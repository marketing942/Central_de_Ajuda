import { serializeJsonLd } from "@/lib/seo";

/** Dados estruturados (schema.org) da página. */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
