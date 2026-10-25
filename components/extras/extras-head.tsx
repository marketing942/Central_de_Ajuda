import Link from "next/link";
import type { ReactNode } from "react";

/** Trilha + título das páginas de Extras. */
export function ExtrasHead({ crumb, titulo, lead }: { crumb?: string; titulo: ReactNode; lead?: string }) {
  return (
    <header className="ex-head">
      <nav className="ex-crumb" aria-label="Você está em">
        <Link href="/">Central</Link>
        <span aria-hidden>›</span>
        {crumb ? (
          <>
            <Link href="/extras">Extras</Link>
            <span aria-hidden>›</span>
            <span aria-current="page">{crumb}</span>
          </>
        ) : (
          <span aria-current="page">Extras</span>
        )}
      </nav>
      <span className="eyebrow">Extras para alunos</span>
      <h1 className="ex-title">{titulo}</h1>
      {lead && <p className="ex-lead">{lead}</p>}
    </header>
  );
}
