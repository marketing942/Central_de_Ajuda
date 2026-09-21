import type { MetadataRoute } from "next";
import { articleHref } from "@/lib/links";
import { getHelpCenter } from "@/lib/notion/help-center";

// Gerado a cada acesso (dados em cache de 5 min): no build da imagem Docker
// não há token do Notion, e um sitemap estático sairia vazio.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://central-de-ajuda.cppem.com.br";
  const { categories, articles } = await getHelpCenter();
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    ...categories.map((category) => ({ url: `${base}/${category.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...articles.map((article) => ({ url: `${base}${articleHref(article)}`, lastModified: article.updatedAt, priority: 0.6 })),
  ];
}
