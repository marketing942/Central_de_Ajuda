import { ArticleCard, CategoryCard, HelpHero } from "@/components/help-cards";
import { ContactSection } from "@/components/site-chrome";
import { getHelpCenter } from "@/lib/notion/help-center";

export default async function HomePage() {
  const { categories, articles } = await getHelpCenter();
  const featured = articles.filter((article) => article.featured).slice(0, 6);

  return (
    <>
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
