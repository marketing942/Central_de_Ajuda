"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

export function CopyLinkButton({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(new URL(path, window.location.origin).href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copie o link do artigo:", new URL(path, window.location.origin).href);
    }
  }

  return (
    <button type="button" className="copy-link" onClick={copy}>
      {copied ? <Check size={15} aria-hidden /> : <Link2 size={15} aria-hidden />}
      {copied ? "Link copiado" : "Copiar link"}
    </button>
  );
}
