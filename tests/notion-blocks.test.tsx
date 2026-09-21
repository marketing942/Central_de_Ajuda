import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { NotionBlocks } from "@/components/notion-blocks";
import type { NotionBlock } from "@/lib/types";

const text = (content: string, extra: Record<string, unknown> = {}) => ({
  plain_text: content,
  href: null,
  annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" },
  ...extra,
});

let seq = 0;
const block = (type: string, data: Record<string, unknown>, children?: NotionBlock[]): NotionBlock => ({
  id: `b${++seq}`,
  type,
  has_children: Boolean(children?.length),
  children,
  [type]: data,
});

const render = (blocks: NotionBlock[]) => renderToStaticMarkup(<NotionBlocks blocks={blocks} />);

describe("NotionBlocks", () => {
  it("embute vídeo do YouTube colado com /video", () => {
    const html = render([block("video", { type: "external", external: { url: "https://youtu.be/dQw4w9WgXcQ" }, caption: [text("Como acessar")] })]);
    expect(html).toContain('<iframe src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
    expect(html).toContain("allowFullScreen");
    expect(html).toContain("<figcaption>");
  });

  it("embute link colado com /embed", () => {
    const html = render([block("embed", { url: "https://www.loom.com/share/0123456789abcdef", caption: [] })]);
    expect(html).toContain('src="https://www.loom.com/embed/0123456789abcdef"');
  });

  it("usa <video> para arquivo enviado direto ao Notion", () => {
    const url = "https://prod-files-secure.s3.us-west-2.amazonaws.com/a/b/aula.mp4?sig=1";
    const html = render([block("video", { type: "file", file: { url }, caption: [] })]);
    expect(html).toContain("<video");
  });

  it("agrupa itens de lista consecutivos e renderiza filhos", () => {
    const html = render([
      block("numbered_list_item", { rich_text: [text("Primeiro")] }),
      block("numbered_list_item", { rich_text: [text("Segundo")] }, [block("bulleted_list_item", { rich_text: [text("Detalhe")] })]),
      block("paragraph", { rich_text: [text("Fim")] }),
    ]);
    expect(html).toMatch(/^<ol><li[^>]*>.*Primeiro.*<li[^>]*>.*Segundo.*<ul><li[^>]*>.*Detalhe.*<\/ul><\/li><\/ol><p>/);
  });

  it("renderiza toggle, callout e link com segurança", () => {
    const html = render([
      block("toggle", { rich_text: [text("Pergunta")] }, [block("paragraph", { rich_text: [text("Resposta")] })]),
      block("callout", { rich_text: [text("Atenção", { href: "javascript:alert(1)" })], icon: { type: "emoji", emoji: "⚠️" }, color: "yellow_background" }),
    ]);
    expect(html).toContain("<details");
    expect(html).toContain("Resposta");
    expect(html).toContain("⚠️");
    expect(html).not.toContain("javascript:");
  });
});
