import { notFound } from "next/navigation";
import { ArticleModal } from "@/components/article-modal";
import { ArticleView } from "@/components/article-view";
import { ContactInline } from "@/components/site-chrome";
import { getArticle } from "@/lib/notion/help-center";

// Clique num artigo dentro do site: abre o popup sobre a página atual.
// Link direto ou F5 cai em app/artigo/[categoria]/[artigo]/page.tsx (página inteira).
export default async function ArticleModalPage({ params }: PageProps<"/artigo/[categoria]/[artigo]">) {
  const { categoria, artigo } = await params;
  const data = await getArticle(categoria, artigo);
  if (!data) notFound();

  return (
    <ArticleModal labelledBy="artigo-titulo">
      <ArticleView article={data.article} blocks={data.blocks} titleId="artigo-titulo" headingLevel={2} />
      <ContactInline />
    </ArticleModal>
  );
}
