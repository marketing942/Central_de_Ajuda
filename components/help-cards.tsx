import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Star } from "lucide-react";
import { CategoryIcon } from "@/components/category-icon";
import { HelpSearch, type SearchItem } from "@/components/help-search";
import { articleHref } from "@/lib/links";
import type { ArticleSummary, Category } from "@/lib/types";

export function toSearchItems(articles: ArticleSummary[]): SearchItem[] {
  return articles.map((article) => ({
    id: article.id,
    title: article.title,
    summary: article.summary,
    category: article.category,
    href: articleHref(article),
  }));
}

export function HelpHero({ articles, compact = false }: { articles: ArticleSummary[]; compact?: boolean }) {
  if (compact) {
    return (
      <section className="help-hero compact">
        <div className="help-hero-grid" aria-hidden />
        <div className="container help-hero-inner">
          <p className="help-hero-title">Como podemos te ajudar?</p>
          <HelpSearch items={toSearchItems(articles)} />
        </div>
      </section>
    );
  }

  // O banner já traz a marca e "Central de Ajuda" centralizados: título e
  // busca ficam sobre a borda inferior esmaecida, sem cobrir o logo.
  return (
    <section className="help-banner">
      <div className="help-banner-image">
        <Image
          src="/brand/bannerhero.png"
          alt="CPPEM — Central de Ajuda"
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="container help-banner-search">
        <h1 className="help-hero-title">Como podemos te ajudar?</h1>
        <HelpSearch items={toSearchItems(articles)} />
      </div>
    </section>
  );
}

export function CategoryCard({ category }: { category: Category }) {
  const empty = category.articleCount === 0;
  return (
    <Link href={`/${category.slug}`} className="category-card" data-empty={empty}>
      <span className="category-card-icon">
        <CategoryIcon icon={category.icon} size={24} />
      </span>
      <strong>{category.name}</strong>
      <p>{category.description}</p>
      <small>
        {empty ? "Em breve" : `${category.articleCount} ${category.articleCount === 1 ? "artigo" : "artigos"}`}
        <ArrowRight size={14} aria-hidden />
      </small>
    </Link>
  );
}

export function ArticleCard({ article, showCategory = false }: { article: ArticleSummary; showCategory?: boolean }) {
  return (
    <Link href={articleHref(article)} scroll={false} className="article-card">
      <span className="article-card-emoji" aria-hidden>
        {article.emoji ?? "?"}
      </span>
      <span className="article-card-copy">
        {(showCategory || article.featured) && (
          <small>
            {article.featured && (
              <>
                <Star size={12} aria-hidden /> Destaque
              </>
            )}
            {showCategory && article.featured && " · "}
            {showCategory && article.category}
          </small>
        )}
        <strong>{article.title}</strong>
        {article.summary && <p>{article.summary}</p>}
      </span>
      <ChevronRight size={20} className="article-card-arrow" aria-hidden />
    </Link>
  );
}
