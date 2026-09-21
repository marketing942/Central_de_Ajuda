"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { normalizeText } from "@/lib/slug";

export type SearchItem = {
  id: string;
  title: string;
  summary: string;
  category: string;
  href: string;
};

const MAX_RESULTS = 8;

export function HelpSearch({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");
  const listId = useId();

  const indexed = useMemo(
    () => items.map((item) => ({ item, haystack: normalizeText(`${item.title} ${item.summary} ${item.category}`) })),
    [items],
  );

  const terms = normalizeText(query).split(/\s+/).filter(Boolean);
  const results = terms.length
    ? indexed.filter(({ haystack }) => terms.every((term) => haystack.includes(term))).map(({ item }) => item)
    : [];

  return (
    <div className="help-search" role="search">
      <label className="help-search-field">
        <Search size={20} aria-hidden />
        <span className="sr-only">Pesquisar pelo assunto</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => event.key === "Escape" && setQuery("")}
          placeholder="Pesquise pelo assunto"
          autoComplete="off"
          aria-controls={listId}
        />
      </label>
      {terms.length > 0 && (
        <div className="help-search-results" id={listId} aria-live="polite">
          {results.length === 0 ? (
            <p className="help-search-empty">Nenhum artigo encontrado para “{query}”.</p>
          ) : (
            <ul>
              {results.slice(0, MAX_RESULTS).map((item) => (
                <li key={item.id}>
                  <Link href={item.href} scroll={false} onClick={() => setQuery("")}>
                    <span>
                      <small>{item.category}</small>
                      <strong>{item.title}</strong>
                    </span>
                    <ChevronRight size={18} aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
