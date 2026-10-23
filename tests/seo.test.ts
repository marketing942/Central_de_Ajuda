import { describe, expect, it } from "vitest";
import { breadcrumbJsonLd, openGraphFor, serializeJsonLd, SITE_URL } from "@/lib/seo";

describe("breadcrumbJsonLd", () => {
  it("começa na home da Central e numera a partir de 1", () => {
    const data = breadcrumbJsonLd([
      { name: "Acesso", path: "/acesso" },
      { name: "Como entrar", path: "/artigo/acesso/como-entrar" },
    ]);
    expect(data.itemListElement.map((item) => [item.position, item.name, item.item])).toEqual([
      [1, "Central de Ajuda CPPEM", `${SITE_URL}/`],
      [2, "Acesso", `${SITE_URL}/acesso`],
      [3, "Como entrar", `${SITE_URL}/artigo/acesso/como-entrar`],
    ]);
  });
});

describe("serializeJsonLd", () => {
  it("não deixa o texto fechar a tag <script>", () => {
    const html = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
    expect(html).not.toContain("<");
    expect(JSON.parse(html).name).toBe("</script><script>alert(1)</script>");
  });
});

describe("openGraphFor", () => {
  it("mantém locale e siteName, que o merge raso do Next perderia", () => {
    expect(openGraphFor({ title: "T", description: "D", path: "/acesso" })).toMatchObject({
      url: "/acesso",
      type: "website",
      locale: "pt_BR",
      siteName: "Central de Ajuda CPPEM",
    });
  });
});
