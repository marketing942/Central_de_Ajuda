import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ArticleView } from "@/components/article-view";
import { ArticleCard } from "@/components/help-cards";
import { ContactSection } from "@/components/site-chrome";
import { getArticle } from "@/lib/notion/help-center";

export async function generateMetadata({ params }: PageProps<"/artigo/[categoria]/[artigo]">): Promise<Metadata> {
  const { categoria, artigo } = await params;
  const data = await getArticle(categoria, artigo);
  if (!data) return {};
  return {
    title: data.article.title,
    description: data.article.summary || `${data.category.name} — Central de Ajuda CPPEM`,
    alternates: { canonical: `/artigo/${categoria}/${artigo}` },
  };
}

// Página inteira do artigo: link compartilhado, F5 e buscadores.
export default async function ArticlePage({ params }: PageProps<"/artigo/[categoria]/[artigo]">) {
  const { categoria, artigo } = await params;
  const data = await getArticle(categoria, artigo);
  if (!data) notFound();

  return (
    <>
      <section className="section article-page">
        <div className="container article-page-layout">
          <nav className="breadcrumb" aria-label="Você está em">
            <Link href="/">Central de Ajuda</Link>
            <ChevronRight size={14} aria-hidden />
            <Link href={`/${data.category.slug}`}>{data.category.name}</Link>
          </nav>
          <div className="article-surface">
            <ArticleView article={data.article} blocks={data.blocks} />
          </div>
          {data.related.length > 0 && (
            <aside className="related" aria-labelledby="relacionados-titulo">
              <h2 id="relacionados-titulo" className="related-title">Outras dúvidas em {data.category.name}</h2>
              <div className="article-list">
                {data.related.map((article) => <ArticleCard key={article.id} article={article} />)}
              </div>
            </aside>
          )}
        </div>
      </section>
      <ContactSection />
    </>
  );
}
