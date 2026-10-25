import type { Metadata } from "next";
import { CalendarCheck, Dumbbell, ExternalLink, NotebookPen, Target, TrendingUp } from "lucide-react";
import { ExtrasHead } from "@/components/extras/extras-head";
import { LINKS } from "@/lib/extras/dados";
import "../extras.css";

export const metadata: Metadata = {
  title: "Metas e organização pessoal",
  description: "App Life Board: metas do ano, rotina de treino, anotações por área da vida e evolução.",
  alternates: { canonical: "/extras/metas" },
};

const RECURSOS = [
  { Icone: Target, texto: "Metas do ano" },
  { Icone: Dumbbell, texto: "Rotina de treino semanal" },
  { Icone: NotebookPen, texto: "Anotações para cada área da vida" },
  { Icone: TrendingUp, texto: "Acompanhe sua evolução" },
];

export default function MetasPage() {
  return (
    <section className="ex-page">
      <div className="container" style={{ maxWidth: 1000 }}>
        <ExtrasHead crumb="Metas e organização" titulo={<>Metas e <em>organização pessoal</em></>} lead="Grandes resultados vêm da constância. Organize metas, treinos e rotina num lugar só." />
        <div className="ex-box destaque">
          <div className="ex-box-head">
            <span className="ex-icon"><CalendarCheck size={22} aria-hidden /></span>
            <div>
              <p className="ex-kicker">App do CPPEM</p>
              <h2>Life Board</h2>
            </div>
          </div>
          <p className="ex-text">
            Coloque suas metas do ano, monte a rotina de treino da semana, faça anotações para cada área da vida e veja
            sua evolução, tudo num lugar só.
          </p>
          <ul className="ex-features">{RECURSOS.map(({ Icone, texto }) => <li key={texto}><Icone size={16} aria-hidden /> {texto}</li>)}</ul>
          <p className="ex-text">Idealizado e recomendado por <strong style={{ color: "var(--gold-pale)" }}>Itallo Mota</strong>.</p>
          <div className="ex-actions">
            <a href={LINKS.lifeBoard} target="_blank" rel="noreferrer" className="gold-button"><ExternalLink size={16} aria-hidden /> Abrir o Life Board</a>
          </div>
        </div>
      </div>
    </section>
  );
}
