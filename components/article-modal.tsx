"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

// Popup do artigo. Só existe enquanto a rota interceptada estiver ativa:
// fechar = voltar no histórico, o que desmonta o conteúdo e, com ele, os
// iframes — o vídeo para de tocar junto.
export function ArticleModal({ children, labelledBy }: { children: ReactNode; labelledBy: string }) {
  const router = useRouter();
  const dialog = useRef<HTMLDivElement>(null);
  const close = useCallback(() => router.back(), [router]);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [close]);

  return (
    <div className="article-modal">
      <div className="article-modal-backdrop" onClick={close} aria-hidden />
      <div ref={dialog} className="article-modal-dialog" role="dialog" aria-modal="true" aria-labelledby={labelledBy} tabIndex={-1}>
        <button type="button" className="article-modal-close" onClick={close} aria-label="Fechar">
          <X size={20} />
        </button>
        <div className="article-modal-scroll">{children}</div>
      </div>
    </div>
  );
}
