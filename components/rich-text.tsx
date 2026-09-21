import type { ReactNode } from "react";
import type { RichText as RichTextItem } from "@/lib/types";

function safeHref(href: string) {
  if (href.startsWith("/")) return href;
  try {
    const url = new URL(href);
    return ["https:", "http:", "mailto:", "tel:"].includes(url.protocol) ? href : null;
  } catch {
    return null;
  }
}

export function RichText({ items }: { items: unknown }) {
  if (!Array.isArray(items)) return null;

  return (items as RichTextItem[]).map((item, index) => {
    const { annotations: a } = item;
    let node: ReactNode = item.plain_text;
    if (a?.code) node = <code>{node}</code>;
    if (a?.bold) node = <strong>{node}</strong>;
    if (a?.italic) node = <em>{node}</em>;
    if (a?.strikethrough) node = <s>{node}</s>;
    if (a?.underline) node = <u>{node}</u>;
    if (a?.color && a.color !== "default") node = <span className={`notion-color-${a.color}`}>{node}</span>;

    const href = item.href ? safeHref(item.href) : null;
    if (href) {
      const external = /^https?:/.test(href);
      node = (
        <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
          {node}
        </a>
      );
    }
    return <span key={index}>{node}</span>;
  });
}
