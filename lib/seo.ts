import type { Metadata } from "next";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://central-de-ajuda.cppem.com.br").replace(/\/+$/, "");
export const SITE_NAME = "Central de Ajuda CPPEM";

const ORGANIZATION_ID = "https://cppem.com.br/#organization";

/** Imagem de compartilhamento (1200×630, recortada do banner da home). */
export const OG_IMAGE = { url: "/brand/og-central-de-ajuda.jpg", width: 1200, height: 630, alt: "CPPEM — Central de Ajuda" };

/** Open Graph completo de uma página. O Next substitui o `openGraph` do layout
 * inteiro (merge raso), então locale, siteName e imagem precisam vir junto. */
export function openGraphFor({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): NonNullable<Metadata["openGraph"]> {
  return { title, description, url: path, type, locale: "pt_BR", siteName: SITE_NAME, images: [OG_IMAGE] };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: "CPPEM Concursos Públicos",
        alternateName: "CPPEM",
        url: "https://cppem.com.br/",
        logo: `${SITE_URL}/brand/logo-cppem.png`,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        inLanguage: "pt-BR",
        publisher: { "@id": ORGANIZATION_ID },
      },
    ],
  };
}

/** Trilha a partir da home da Central. `path` relativo ao site ("/acesso"). */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  const items = [{ name: SITE_NAME, path: "/" }, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** JSON.stringify para dentro de <script>: títulos vêm do Notion, então um
 * "</script>" no texto não pode fechar a tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
