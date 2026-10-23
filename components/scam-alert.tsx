import Link from "next/link";
import { ArrowUpRight, ShieldAlert } from "lucide-react";
import { SCAM_CHECK_PATH } from "@/lib/contact";

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
      <Link className="gold-button" href={SCAM_CHECK_PATH}>
        Confirmar número <ArrowUpRight size={16} aria-hidden />
      </Link>
    </aside>
  );
}
