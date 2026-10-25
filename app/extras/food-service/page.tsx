import type { Metadata } from "next";
import { Coffee, CupSoda, ExternalLink, Pizza, Sandwich, Soup, UtensilsCrossed } from "lucide-react";
import { ExtrasHead } from "@/components/extras/extras-head";
import { Locais } from "@/components/extras/locais";
import { APPS_DELIVERY } from "@/lib/extras/dados";
import "../extras.css";

export const metadata: Metadata = {
  title: "Food Service",
  description: "Restaurante parceiro, cantinas do prédio e apps de delivery para quem está na sede do CPPEM.",
  alternates: { canonical: "/extras/food-service" },
};

const ICONES = [
  { Icone: UtensilsCrossed, s: { left: "6%", top: "18%", width: 72, height: 72, transform: "rotate(-12deg)" } },
  { Icone: Coffee, s: { left: "22%", bottom: "10%", width: 48, height: 48 } },
  { Icone: Pizza, s: { right: "24%", top: "10%", width: 56, height: 56, transform: "rotate(12deg)" } },
  { Icone: Sandwich, s: { right: "6%", bottom: "14%", width: 72, height: 72 } },
  { Icone: Soup, s: { right: "42%", bottom: "6%", width: 48, height: 48 } },
  { Icone: CupSoda, s: { left: "40%", top: "8%", width: 40, height: 40 } },
];

export default function FoodServicePage() {
  return (
    <section className="ex-page">
      <div className="container">
        <ExtrasHead crumb="Food Service" titulo={<>Food <em>Service</em></>} />
        <div className="ex-banner">
          <div className="ex-banner-art">
            {ICONES.map(({ Icone, s }, i) => <Icone key={i} strokeWidth={1.3} aria-hidden style={s} />)}
            <div className="ex-banner-copy">
              <span className="ex-kicker" style={{ display: "block" }}>Bom apetite</span>
              <b>Food Service</b>
              <span>Almoço, lanche e delivery para o seu dia no CPPEM</span>
            </div>
          </div>
          <p className="ex-banner-foot">
            Vale para quem está na sede do CPPEM. O selo &quot;Provavelmente ativa&quot; segue o horário de cada lugar;
            como são parceiros do CPPEM, pode acontecer de estarem fechados mesmo no horário.
          </p>
        </div>

        <h2 className="eyebrow ex-section-label">Onde comer</h2>
        <Locais />

        <h2 className="eyebrow ex-section-label">Apps recomendados</h2>
        <ul className="ex-list">
          {APPS_DELIVERY.map((app) => (
            <li key={app.nome}>
              <a href={app.url} target="_blank" rel="noreferrer" className="ex-app">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={app.logo} alt="" width={48} height={48} />
                <span><strong>{app.nome}</strong><span>{app.descricao}</span></span>
                <ExternalLink size={16} aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
