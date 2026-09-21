import { ExternalLink, FileText, PlayCircle } from "lucide-react";
import { RichText } from "@/components/rich-text";
import { resolveEmbed } from "@/lib/embed";
import type { NotionBlock } from "@/lib/types";

type Value = {
  rich_text?: unknown;
  caption?: unknown;
  color?: string;
  checked?: boolean;
  language?: string;
  is_toggleable?: boolean;
  icon?: { type?: string; emoji?: string } | null;
  type?: "external" | "file" | "file_upload";
  external?: { url?: string };
  file?: { url?: string };
  url?: string;
  name?: string;
  has_column_header?: boolean;
  cells?: unknown[][];
};

function value(block: NotionBlock): Value {
  return (block[block.type] as Value | undefined) ?? {};
}

function fileUrl(data: Value): string {
  return (data.type === "external" ? data.external?.url : data.file?.url) ?? data.url ?? "";
}

function colorClass(data: Value) {
  return data.color && data.color !== "default" ? `notion-color-${data.color}` : undefined;
}

function hostOf(url: string) {
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === "https:" || protocol === "http:" ? hostname.replace(/^www\./, "") : null;
  } catch {
    return null;
  }
}

function hasText(richText: unknown) {
  return Array.isArray(richText) && richText.length > 0;
}

function Caption({ data }: { data: Value }) {
  return hasText(data.caption) ? <figcaption><RichText items={data.caption} /></figcaption> : null;
}

function EmbedBlock({ url, data, label }: { url: string; data: Value; label: string }) {
  const embed = resolveEmbed(url);
  if (!embed) return null;

  if (embed.kind === "iframe") {
    return (
      <figure className="article-embed">
        <div className={`embed-frame embed-${embed.aspect}`}>
          <iframe
            src={embed.src}
            title={`${label} (${embed.provider})`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <Caption data={data} />
      </figure>
    );
  }

  if (embed.kind === "file") {
    return (
      <figure className="article-embed">
        <div className="embed-frame embed-video">
          <video src={embed.src} controls preload="metadata" playsInline />
        </div>
        <Caption data={data} />
      </figure>
    );
  }

  return (
    <a className="article-link-card" href={embed.href} target="_blank" rel="noreferrer">
      {label === "Vídeo" ? <PlayCircle size={20} /> : <ExternalLink size={20} />}
      <span>
        <strong>{hasText(data.caption) ? <RichText items={data.caption} /> : "Abrir link"}</strong>
        <small>{hostOf(embed.href)}</small>
      </span>
    </a>
  );
}

function Children({ block }: { block: NotionBlock }) {
  return block.children?.length ? <NotionBlocks blocks={block.children} /> : null;
}

function Block({ block }: { block: NotionBlock }) {
  const data = value(block);

  switch (block.type) {
    case "paragraph":
      return hasText(data.rich_text) ? (
        <p className={colorClass(data)}>
          <RichText items={data.rich_text} />
        </p>
      ) : null;

    case "heading_1":
    case "heading_2":
    case "heading_3": {
      // Dentro do artigo o título da página já é o h1/h2; os títulos do Notion descem um nível.
      const Tag = block.type === "heading_1" ? "h2" : block.type === "heading_2" ? "h3" : "h4";
      const heading = (
        <Tag className={colorClass(data)}>
          <RichText items={data.rich_text} />
        </Tag>
      );
      if (!data.is_toggleable) return heading;
      return (
        <details className="article-toggle">
          <summary>{heading}</summary>
          <Children block={block} />
        </details>
      );
    }

    case "toggle":
      return (
        <details className="article-toggle">
          <summary>
            <RichText items={data.rich_text} />
          </summary>
          <Children block={block} />
        </details>
      );

    case "to_do":
      return (
        <div className="article-todo" data-checked={data.checked}>
          <input type="checkbox" checked={Boolean(data.checked)} readOnly aria-label="Item da lista" />
          <span>
            <RichText items={data.rich_text} />
          </span>
          <Children block={block} />
        </div>
      );

    case "quote":
      return (
        <blockquote>
          <RichText items={data.rich_text} />
          <Children block={block} />
        </blockquote>
      );

    case "callout":
      return (
        <aside className={`article-callout ${colorClass(data) ?? ""}`}>
          {data.icon?.type === "emoji" && <span className="article-callout-icon" aria-hidden>{data.icon.emoji}</span>}
          <div>
            <p>
              <RichText items={data.rich_text} />
            </p>
            <Children block={block} />
          </div>
        </aside>
      );

    case "divider":
      return <hr />;

    case "code":
      return (
        <pre className="article-code">
          <code>
            <RichText items={data.rich_text} />
          </code>
        </pre>
      );

    case "image": {
      const src = fileUrl(data);
      if (!src) return null;
      const alt = Array.isArray(data.caption)
        ? data.caption.map((item) => (item as { plain_text?: string }).plain_text ?? "").join("")
        : "";
      return (
        <figure className="article-image">
          {/* eslint-disable-next-line @next/next/no-img-element -- URL do Notion muda a cada hora, sem next/image */}
          <img src={src} alt={alt} loading="lazy" />
          <Caption data={data} />
        </figure>
      );
    }

    case "video":
      return <EmbedBlock url={fileUrl(data)} data={data} label="Vídeo" />;

    case "embed":
      return <EmbedBlock url={data.url ?? ""} data={data} label="Conteúdo incorporado" />;

    case "bookmark":
    case "link_preview": {
      const url = data.url ?? "";
      const host = hostOf(url);
      if (!host) return null;
      return (
        <a className="article-link-card" href={url} target="_blank" rel="noreferrer">
          <ExternalLink size={20} />
          <span>
            <strong>{hasText(data.caption) ? <RichText items={data.caption} /> : host}</strong>
            <small>{host}</small>
          </span>
        </a>
      );
    }

    case "file":
    case "pdf": {
      const url = fileUrl(data);
      if (!url) return null;
      return (
        <a className="article-link-card" href={url} target="_blank" rel="noreferrer">
          <FileText size={20} />
          <span>
            <strong>{hasText(data.caption) ? <RichText items={data.caption} /> : data.name || "Abrir arquivo"}</strong>
            <small>{block.type === "pdf" ? "PDF" : "Arquivo"}</small>
          </span>
        </a>
      );
    }

    case "table": {
      const rows = block.children ?? [];
      const [head, ...body] = data.has_column_header ? rows : [null, ...rows];
      const cells = (row: NotionBlock) => (row.table_row as { cells?: unknown[] } | undefined)?.cells ?? [];
      return (
        <div className="article-table">
          <table>
            {head && (
              <thead>
                <tr>{cells(head).map((cell, i) => <th key={i}><RichText items={cell} /></th>)}</tr>
              </thead>
            )}
            <tbody>
              {body.map((row) => row && (
                <tr key={row.id}>{cells(row).map((cell, i) => <td key={i}><RichText items={cell} /></td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case "column_list":
      return (
        <div className="article-columns">
          {block.children?.map((column) => (
            <div key={column.id}>
              <Children block={column} />
            </div>
          ))}
        </div>
      );

    case "synced_block":
      return <Children block={block} />;

    default:
      return null;
  }
}

const LIST_TYPES = { bulleted_list_item: "ul", numbered_list_item: "ol" } as const;
type ListType = keyof typeof LIST_TYPES;

export function NotionBlocks({ blocks }: { blocks: NotionBlock[] }) {
  // A API entrega itens de lista soltos; agrupa os consecutivos em <ul>/<ol>.
  type Group = { kind: "block"; id: string; block: NotionBlock } | { kind: "list"; list: ListType; id: string; items: NotionBlock[] };
  const groups: Group[] = [];
  for (const block of blocks) {
    const last = groups.at(-1);
    if (block.type in LIST_TYPES) {
      if (last?.kind === "list" && last.list === block.type) last.items.push(block);
      else groups.push({ kind: "list", list: block.type as ListType, id: block.id, items: [block] });
    } else groups.push({ kind: "block", id: block.id, block });
  }

  return groups.map((group) => {
    if (group.kind === "block") return <Block key={group.id} block={group.block} />;
    const List = LIST_TYPES[group.list];
    return (
      <List key={group.id}>
        {group.items.map((item) => (
          <li key={item.id} className={colorClass(value(item))}>
            <RichText items={value(item).rich_text} />
            <Children block={item} />
          </li>
        ))}
      </List>
    );
  });
}
