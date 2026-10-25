import type { Metadata } from "next";
import { Activity, Bike, Check, Dumbbell, HeartPulse, MapPin, Navigation, Timer } from "lucide-react";
import { ExtrasHead } from "@/components/extras/extras-head";
import { MaisPerto } from "@/components/extras/mais-perto";
import { BENEFICIO_SELFIT as B, rotaUrl, SELFIT_CARUARU } from "@/lib/extras/dados";
import "../extras.css";

export const metadata: Metadata = {
  title: "Academia Selfit",
  description: "Alunos do CPPEM têm o Plano Plus Corporativo Selfit, válido em todas as unidades do Brasil.",
  alternates: { canonical: "/extras/academia" },
};

const ICONES = [
  { Icone: Dumbbell, s: { left: "5%", top: "16%", width: 84, height: 84, transform: "rotate(-12deg)" } },
  { Icone: HeartPulse, s: { left: "24%", bottom: "8%", width: 48, height: 48 } },
  { Icone: Activity, s: { right: "22%", top: "10%", width: 56, height: 56 } },
  { Icone: Bike, s: { right: "5%", bottom: "12%", width: 72, height: 72 } },
  { Icone: Timer, s: { right: "42%", bottom: "6%", width: 44, height: 44 } },
];

export default function AcademiaPage() {
  return (
    <section className="ex-page">
      <div className="container">
        <ExtrasHead crumb="Academia" titulo={<>Academia <em>Selfit</em></>} />
        <div className="ex-banner">
          <div className="ex-banner-art vermelho">
            {ICONES.map(({ Icone, s }, i) => <Icone key={i} strokeWidth={1.3} aria-hidden style={s} />)}
            <div className="ex-banner-copy">
              <span className="ex-kicker" style={{ display: "block" }}>Parceria CPPEM + Selfit</span>
              <b>Treine com desconto</b>
              <span>{B.abrangencia}</span>
            </div>
          </div>
        </div>

        <div className="ex-cols">
          <div className="ex-box dourado">
            <p className="ex-kicker">{B.plano}</p>
            <p className="ex-preco">{B.mensalidade}<small>/mês</small></p>
            <ul className="ex-check">
              {B.isencoes.map((item) => <li key={item}><Check size={16} aria-hidden /> {item} isenta</li>)}
            </ul>
          </div>
          <div className="ex-box">
            <h2 className="eyebrow">Como funciona</h2>
            <p className="ex-text">{B.quem}</p>
            <p className="ex-text">{B.abrangencia} O plano inclui as áreas e aulas previstas nele:</p>
            <ul className="ex-chips">{B.inclui.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>

        <div style={{ marginTop: "1rem" }}><MaisPerto /></div>

        <h2 className="eyebrow ex-section-label">As {SELFIT_CARUARU.length} unidades de Caruaru</h2>
        <ul className="ex-list">
          {SELFIT_CARUARU.map((u) => (
            <li key={u.url} className="ex-unidade">
              <div className="ex-local-top">
                <h3 style={{ margin: 0 }}>Selfit {u.nome}</h3>
                {u.emBreve && <span className="ex-status">Pré-venda</span>}
              </div>
              <p className="ex-endereco"><MapPin size={14} aria-hidden /><span>{u.endereco}</span></p>
              <div className="ex-actions">
                <a href={rotaUrl(u)} target="_blank" rel="noreferrer" className="gold-button"><Navigation size={16} aria-hidden /> Como chegar</a>
                <a href={u.url} target="_blank" rel="noreferrer" className="ghost-button">Ver unidade</a>
              </div>
            </li>
          ))}
        </ul>
        <p className="ex-note">Unidades e endereços do site da Selfit. A Life Center ainda está em pré-venda: confira a abertura com a Selfit.</p>
      </div>
    </section>
  );
}
