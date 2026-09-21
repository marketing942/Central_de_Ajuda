import { CalendarClock } from "lucide-react";
import { CopyLinkButton } from "@/components/copy-link-button";
import { NotionBlocks } from "@/components/notion-blocks";
import { articleHref } from "@/lib/links";
import type { ArticleSummary, NotionBlock } from "@/lib/types";

const dateFormat = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "America/Recife" });

export function ArticleView({
  article,
  blocks,
  titleId,
  headingLevel = 1,
}: {
  article: ArticleSummary;
  blocks: NotionBlock[];
  titleId?: string;
  headingLevel?: 1 | 2;
}) {
  const Title = headingLevel === 1 ? "h1" : "h2";
  return (
    <article className="article">
      <header className="article-header">
        <span className="eyebrow">{article.category}</span>
        <Title id={titleId} className="article-title">
          {article.emoji && <span aria-hidden>{article.emoji} </span>}
          {article.title}
        </Title>
        <div className="article-meta">
          <span>
            <CalendarClock size={15} aria-hidden /> Atualizado em {dateFormat.format(new Date(article.updatedAt))}
          </span>
          <CopyLinkButton path={articleHref(article)} />
        </div>
      </header>
      <div className="article-body">
        {blocks.length > 0 ? (
          <NotionBlocks blocks={blocks} />
        ) : (
          <p className="article-empty">O conteúdo deste artigo não pôde ser carregado agora. Tente novamente em instantes.</p>
        )}
      </div>
    </article>
  );
}
