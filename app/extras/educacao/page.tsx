import type { Metadata } from "next";
import { BookOpenCheck, ExternalLink, GraduationCap, School } from "lucide-react";
import { ExtrasHead } from "@/components/extras/extras-head";
import { EDUCACAO } from "@/lib/extras/dados";
import "../extras.css";

export const metadata: Metadata = {
  title: "Educação",
  description: "Supletivo, faculdade EAD e colégio do Grupo CPPEM, com condições especiais para alunos e familiares.",
  alternates: { canonical: "/extras/educacao" },
};

const ICONES = [BookOpenCheck, GraduationCap, School];

export default function EducacaoPage() {
  return (
    <section className="ex-page">
      <div className="container" style={{ maxWidth: 1100 }}>
        <ExtrasHead crumb="Educação" titulo={<>Educação <em>para você e sua família</em></>} lead="Além do preparatório, o Grupo CPPEM tem opções para cada etapa dos estudos." />
        <ul className="ex-list">
          {EDUCACAO.map((item, i) => {
            const Icone = ICONES[i];
            return (
              <li key={item.url} className="ex-box" style={{ display: "flex", flexDirection: "column" }}>
                <span className="ex-icon"><Icone size={22} aria-hidden /></span>
                <p className="ex-kicker" style={{ marginTop: "1rem" }}>{item.tipo}</p>
                <h2 style={{ marginTop: ".25rem" }}>{item.nome}</h2>
                {item.destaque && <span className="ex-tag verde" style={{ alignSelf: "flex-start" }}>{item.destaque}</span>}
                <p className="ex-text" style={{ flex: 1 }}>{item.texto}</p>
                <div className="ex-actions">
                  <a href={item.url} target="_blank" rel="noreferrer" className="gold-button"><ExternalLink size={16} aria-hidden /> Conhecer</a>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="ex-note">Condições conforme a rede de parceiros do CPPEM. Confirme os detalhes com cada instituição.</p>
      </div>
    </section>
  );
}
