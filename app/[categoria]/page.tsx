import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { CategoryIcon } from "@/components/category-icon";
import { ArticleCard, HelpHero } from "@/components/help-cards";
import { JsonLd } from "@/components/json-ld";
import { ContactSection } from "@/components/site-chrome";
import { getCategory, getHelpCenter } from "@/lib/notion/help-center";
import { breadcrumbJsonLd, openGraphFor } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[categoria]">): Promise<Metadata> {
  const data = await getCategory((await params).categoria);
  if (!data) return {};
  const { name, description, slug } = data.category;
  return {
    title: name,
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: openGraphFor({ title: `${name} | Central de Ajuda CPPEM`, description, path: `/${slug}` }),
  };
}

export default async function CategoryPage({ params }: PageProps<"/[categoria]">) {
  const { categoria } = await params;
  const [data, { articles: allArticles }] = await Promise.all([getCategory(categoria), getHelpCenter()]);
  if (!data) notFound();
  const { category, categories, articles } = data;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: category.name, path: `/${category.slug}` }])} />
      <HelpHero articles={allArticles} compact />

      <section className="section">
        <div className="container category-layout">
          <aside className="category-sidebar" aria-label="Outras categorias">
            <Link href="/" className="back-link">
              <ChevronLeft size={16} aria-hidden /> Todas as categorias
            </Link>
            <nav>
              {categories.map((item) => (
                <Link key={item.slug} href={`/${item.slug}`} aria-current={item.slug === category.slug ? "page" : undefined}>
                  <CategoryIcon icon={item.icon} size={16} />
                  <span>{item.name}</span>
                  <small>{item.articleCount}</small>
                </Link>
              ))}
            </nav>
          </aside>

          <div className="category-content">
            <header className="category-header">
              <span className="category-card-icon large">
                <CategoryIcon icon={category.icon} size={28} />
              </span>
              <div>
                <h1 className="section-title">{category.name}</h1>
                <p className="section-copy">{category.description}</p>
              </div>
            </header>

            {articles.length > 0 ? (
              <div className="article-list">
                {articles.map((article) => <ArticleCard key={article.id} article={article} />)}
              </div>
            ) : (
              <p className="empty-state">
                Ainda não há artigos publicados nesta categoria. Enquanto isso, fale com a nossa equipe pelos canais abaixo.
              </p>
            )}
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
