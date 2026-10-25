"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Botão que copia o texto e mostra "Copiado" por um instante. */
export function Copiar({ valor, rotulo }: { valor: string; rotulo: string }) {
  const [ok, setOk] = useState(false);
  async function copiar() {
    try {
      await navigator.clipboard.writeText(valor);
    } catch {
      const campo = document.createElement("textarea");
      campo.value = valor;
      document.body.appendChild(campo);
      campo.select();
      document.execCommand("copy");
      campo.remove();
    }
    setOk(true);
    setTimeout(() => setOk(false), 1600);
  }
  return (
    <button type="button" className="ex-copy" data-ok={ok} onClick={copiar}>
      {ok ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
      {ok ? "Copiado" : rotulo}
    </button>
  );
}
