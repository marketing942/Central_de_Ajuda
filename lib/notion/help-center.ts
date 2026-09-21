import "server-only";
import { Client } from "@notionhq/client";
import { unstable_cache } from "next/cache";
import { categoryMeta } from "@/lib/categories";
import { slugify, uniqueSlug } from "@/lib/slug";
import type { ArticleSummary, Category, HelpCenter, NotionBlock } from "@/lib/types";

// Nomes das colunas no Notion. Renomear uma coluna lá exige renomear aqui.
const PROP = {
  title: "Dúvida / assunto",
  category: "Categoria",
  status: "Status",
  featured: "Destaque",
  // Opcionais: se a coluna não existir, o site segue funcionando sem ela.
  summary: "Resumo",
  order: "Ordem",
  slug: "Slug",
} as const;

const PUBLISHED = "Publicado";
export const HELP_CENTER_TAG = "central-de-ajuda";
const REVALIDATE_SECONDS = 300;
const MAX_DEPTH = 4;

const token = process.env.NOTION_TOKEN;
const notion = token ? new Client({ auth: token }) : null;

type Props = Record<string, unknown>;

function plainText(value: unknown): string {
  if (!Array.isArray(value)) return "";
  return value.map((fragment) => (fragment as { plain_text?: string })?.plain_text ?? "").join("").trim();
}

function readTitle(props: Props, key: string) {
  return plainText((props[key] as { title?: unknown } | undefined)?.title);
}

function readRichText(props: Props, key: string) {
  return plainText((props[key] as { rich_text?: unknown } | undefined)?.rich_text);
}

function readSelect(props: Props, key: string) {
  return (props[key] as { select?: { name?: string } | null } | undefined)?.select?.name ?? "";
}

function readCheckbox(props: Props, key: string) {
  return (props[key] as { checkbox?: boolean } | undefined)?.checkbox === true;
}

function readNumber(props: Props, key: string) {
  const number = (props[key] as { number?: number | null } | undefined)?.number;
  return typeof number === "number" ? number : null;
}

async function resolveDataSourceId(client: Client, databaseId: string) {
  const database = await client.databases.retrieve({ database_id: databaseId });
  return (database as { data_sources?: Array<{ id: string }> }).data_sources?.[0]?.id ?? null;
}

function byRelevance(a: ArticleSummary, b: ArticleSummary) {
  return (
    Number(b.featured) - Number(a.featured) ||
    (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER) ||
    a.title.localeCompare(b.title, "pt-BR")
  );
}

async function fetchHelpCenter(): Promise<HelpCenter> {
  const databaseId = process.env.NOTION_AJUDA_DATABASE_ID;
  if (!notion || !databaseId) {
    console.warn("[ajuda] NOTION_TOKEN ou NOTION_AJUDA_DATABASE_ID ausente — central vazia.");
    return { categories: [], articles: [] };
  }

  try {
    const dataSourceId = await resolveDataSourceId(notion, databaseId);
    if (!dataSourceId) return { categories: [], articles: [] };

    const dataSource = await notion.dataSources.retrieve({ data_source_id: dataSourceId });
    const categoryProp = (dataSource as { properties?: Props }).properties?.[PROP.category] as
      | { select?: { options?: Array<{ name: string }> } }
      | undefined;
    const categoryNames = categoryProp?.select?.options?.map((option) => option.name) ?? [];

    const articles: ArticleSummary[] = [];
    let cursor: string | undefined;

    do {
      const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        filter: { property: PROP.status, status: { equals: PUBLISHED } },
        start_cursor: cursor,
        page_size: 100,
      });

      for (const page of response.results) {
        const { id, properties, icon, last_edited_time } = page as {
          id: string;
          properties?: Props;
          icon?: { type?: string; emoji?: string } | null;
          last_edited_time?: string;
        };
        if (!properties) continue;
        const title = readTitle(properties, PROP.title);
        const category = readSelect(properties, PROP.category);
        // Artigo sem categoria não tem onde aparecer: fica fora até ser classificado.
        if (!title || !category) continue;

        articles.push({
          id,
          title,
          slug: readRichText(properties, PROP.slug),
          category,
          categorySlug: slugify(category),
          summary: readRichText(properties, PROP.summary),
          emoji: icon?.type === "emoji" ? icon.emoji ?? null : null,
          featured: readCheckbox(properties, PROP.featured),
          order: readNumber(properties, PROP.order),
          updatedAt: last_edited_time ?? new Date().toISOString(),
        });
      }

      cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
    } while (cursor);

    // Slug final: coluna "Slug" se preenchida, senão o título. Único por categoria.
    const takenByCategory = new Map<string, Set<string>>();
    for (const article of [...articles].sort((a, b) => a.id.localeCompare(b.id))) {
      const taken = takenByCategory.get(article.categorySlug) ?? new Set<string>();
      takenByCategory.set(article.categorySlug, taken);
      article.slug = uniqueSlug(slugify(article.slug || article.title), taken);
    }

    // Opções do select na ordem do Notion + qualquer categoria usada que não
    // esteja mais nas opções (renomeada, por exemplo).
    for (const article of articles) {
      if (!categoryNames.includes(article.category)) categoryNames.push(article.category);
    }

    const categories: Category[] = categoryNames.map((name) => ({
      name,
      slug: slugify(name),
      ...categoryMeta(name),
      articleCount: articles.filter((article) => article.category === name).length,
    }));

    return { categories, articles: articles.sort(byRelevance) };
  } catch (error) {
    console.error("[ajuda] Falha ao carregar a central do Notion:", error instanceof Error ? error.message : error);
    // Relança para o unstable_cache NÃO guardar a central vazia: a próxima
    // requisição tenta o Notion de novo em vez de ficar 5 min sem conteúdo.
    throw error;
  }
}

const cachedHelpCenter = unstable_cache(fetchHelpCenter, ["central-de-ajuda-index"], {
  revalidate: REVALIDATE_SECONDS,
  tags: [HELP_CENTER_TAG],
});

export async function getHelpCenter(): Promise<HelpCenter> {
  try {
    return await cachedHelpCenter();
  } catch {
    return { categories: [], articles: [] };
  }
}

// Tipos cujo conteúdo filho é outra página ou banco: não entram no artigo.
const SKIP_CHILDREN = new Set(["child_page", "child_database", "unsupported"]);

async function fetchChildren(client: Client, blockId: string, depth: number): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = [];
  let cursor: string | undefined;

  do {
    const response = await client.blocks.children.list({ block_id: blockId, start_cursor: cursor, page_size: 100 });
    blocks.push(...(response.results as unknown as NotionBlock[]));
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  if (depth < MAX_DEPTH) {
    await Promise.all(
      blocks
        .filter((block) => block.has_children && !SKIP_CHILDREN.has(block.type))
        .map(async (block) => {
          // Bloco sincronizado que é cópia: o conteúdo mora no bloco original.
          const synced = block.synced_block as { synced_from?: { block_id?: string } | null } | undefined;
          const sourceId = block.type === "synced_block" && synced?.synced_from?.block_id;
          block.children = await fetchChildren(client, sourceId || block.id, depth + 1);
        }),
    );
  }

  return blocks;
}

async function fetchArticleBlocks(pageId: string): Promise<NotionBlock[]> {
  return notion ? fetchChildren(notion, pageId, 0) : [];
}

// Revalida antes de 1h de propósito: imagens e vídeos enviados direto ao
// Notion chegam com URL assinada que expira em 1h.
const cachedArticleBlocks = unstable_cache(fetchArticleBlocks, ["central-de-ajuda-article"], {
  revalidate: REVALIDATE_SECONDS,
  tags: [HELP_CENTER_TAG],
});

// Mesma regra do índice: erro não entra no cache.
export async function getArticleBlocks(pageId: string): Promise<NotionBlock[]> {
  try {
    return await cachedArticleBlocks(pageId);
  } catch (error) {
    console.error(`[ajuda] Falha ao carregar conteúdo do artigo ${pageId}:`, error instanceof Error ? error.message : error);
    return [];
  }
}

export async function getCategory(categorySlug: string) {
  const { categories, articles } = await getHelpCenter();
  const category = categories.find((item) => item.slug === categorySlug);
  if (!category) return null;
  return { category, categories, articles: articles.filter((article) => article.categorySlug === categorySlug) };
}

export async function getArticle(categorySlug: string, articleSlug: string) {
  const { categories, articles } = await getHelpCenter();
  const article = articles.find((item) => item.categorySlug === categorySlug && item.slug === articleSlug);
  if (!article) return null;
  const category = categories.find((item) => item.slug === categorySlug)!;
  const related = articles.filter((item) => item.categorySlug === categorySlug && item.id !== article.id).slice(0, 5);
  return { article, category, related, blocks: await getArticleBlocks(article.id) };
}
