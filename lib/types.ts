import type { CategoryIcon } from "@/lib/categories";

export type Category = {
  name: string;
  slug: string;
  icon: CategoryIcon;
  description: string;
  articleCount: number;
};

export type ArticleSummary = {
  id: string;
  title: string;
  slug: string;
  category: string;
  categorySlug: string;
  summary: string;
  emoji: string | null;
  featured: boolean;
  order: number | null;
  updatedAt: string;
};

export type RichText = {
  plain_text: string;
  href: string | null;
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
};

/** Bloco do Notion já com os filhos carregados. Mantido solto de propósito:
 * o renderizador lê só os campos de cada tipo que conhece. */
export type NotionBlock = {
  id: string;
  type: string;
  has_children: boolean;
  children?: NotionBlock[];
  [key: string]: unknown;
};

export type HelpCenter = {
  categories: Category[];
  articles: ArticleSummary[];
};
