import type { ArticleSummary } from "@/lib/types";

// Prefixo fixo "/artigo": o popup usa rota interceptada, e o Next não
// intercepta de forma confiável um segmento dinâmico na raiz ((.)[categoria]).
export function articleHref(article: Pick<ArticleSummary, "categorySlug" | "slug">) {
  return `/artigo/${article.categorySlug}/${article.slug}`;
}
