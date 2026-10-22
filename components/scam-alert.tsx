import { ArrowUpRight, ShieldAlert } from "lucide-react";
import { SCAM_CHECK_URL } from "@/lib/contact";

/** Alerta contra golpes, com o link do confirmador de número oficial do CPPEM. */
export function ScamAlert({ as: Heading = "h2", id }: { as?: "h2" | "h3"; id: string }) {
  return (
    <aside className="scam-alert" aria-labelledby={id}>
      <span className="channel-icon" aria-hidden>
        <ShieldAlert size={26} />
      </span>
      <div>
        <Heading id={id}>Não leve golpes!</Heading>
        <p>Confira se o número de WhatsApp é oficial do CPPEM.</p>
      </div>
      <a className="gold-button" href={SCAM_CHECK_URL} target="_blank" rel="noopener noreferrer">
        Confirmar número <ArrowUpRight size={16} aria-hidden />
      </a>
    </aside>
  );
}
