import type { Metadata } from "next";
import { ArticleCard, CategoryCard, HelpHero } from "@/components/help-cards";
import { JsonLd } from "@/components/json-ld";
import { ContactSection } from "@/components/site-chrome";
import { getHelpCenter } from "@/lib/notion/help-center";
import { openGraphFor, websiteJsonLd } from "@/lib/seo";

const title = "Central de Ajuda CPPEM: suporte ao aluno e atendimento";
const description =
  "Orientações oficiais do CPPEM sobre plataforma, turmas, mentoria, materiais e pagamentos, e os canais de atendimento ao aluno no WhatsApp.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: openGraphFor({ title, description, path: "/" }),
};

export default async function HomePage() {
  const { categories, articles } = await getHelpCenter();
  const featured = articles.filter((article) => article.featured).slice(0, 6);

  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <HelpHero articles={articles} />

      <section className="section" aria-labelledby="categorias-titulo">
        <div className="container">
          <h2 id="categorias-titulo" className="sr-only">Categorias</h2>
          {categories.length > 0 ? (
            <div className="category-grid">
              {categories.map((category) => <CategoryCard key={category.slug} category={category} />)}
            </div>
          ) : (
            <p className="empty-state">A central está sendo preparada. Volte em instantes.</p>
          )}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section section-alt" aria-labelledby="frequentes-titulo">
          <div className="container">
            <span className="eyebrow">Mais procuradas</span>
            <h2 id="frequentes-titulo" className="section-title">Dúvidas frequentes</h2>
            <div className="article-list two-columns">
              {featured.map((article) => <ArticleCard key={article.id} article={article} showCategory />)}
            </div>
          </div>
        </section>
      )}

      <ContactSection />
    </>
  );
}
