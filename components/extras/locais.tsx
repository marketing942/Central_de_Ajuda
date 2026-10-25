"use client";

import { MessageCircle } from "lucide-react";
import { LOCAIS } from "@/lib/extras/dados";
import { statusAgora, useAgora } from "@/lib/extras/horario";

/** Restaurante e cantinas com o selo "Provavelmente ativa" pelo horário de Recife. */
export function Locais() {
  const agora = useAgora();
  return (
    <ul className="ex-list">
      {LOCAIS.map((local) => {
        const status = agora === null ? null : statusAgora(local.janelas, agora);
        return (
          <li key={local.id} className="ex-local" data-inativo={status !== null && !status.aberto}>
            <div className="ex-local-top">
              <div>
                <p className="ex-kicker">{local.tipo}</p>
                <h3>{local.nome}</h3>
              </div>
              {status && <span className={`ex-status${status.aberto ? " ativo" : ""}`}>{status.aberto ? "Provavelmente ativa" : "Inativa agora"}</span>}
            </div>
            <p className="ex-text">{local.descricao}</p>
            <p className="ex-horario">{local.horarioTexto}</p>
            {status?.texto && (
              <p className="ex-note">{status.aberto ? `Funcionando ${status.texto}` : status.texto[0].toUpperCase() + status.texto.slice(1)}</p>
            )}
            {local.link && (
              <a className="whatsapp-button compact" href={local.link.url} target="_blank" rel="noreferrer">
                <MessageCircle size={16} aria-hidden /> {local.link.label}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
