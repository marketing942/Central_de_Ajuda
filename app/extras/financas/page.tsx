import type { Metadata } from "next";
import { BookOpen, ChartLine, ExternalLink, PiggyBank, ReceiptText, Wallet } from "lucide-react";
import { ExtrasHead } from "@/components/extras/extras-head";
import { LINKS } from "@/lib/extras/dados";
import "../extras.css";

export const metadata: Metadata = {
  title: "Finanças pessoais",
  description: "App Domínio Financeiro para organizar seu dinheiro e o e-book de educação financeira do CPPEM.",
  alternates: { canonical: "/extras/financas" },
};

const RECURSOS = [
  { Icone: ReceiptText, texto: "Organize seus gastos" },
  { Icone: PiggyBank, texto: "Registre seus investimentos" },
  { Icone: ChartLine, texto: "Acompanhe a evolução do seu patrimônio" },
];

export default function FinancasPage() {
  return (
    <section className="ex-page">
      <div className="container" style={{ maxWidth: 1000 }}>
        <ExtrasHead crumb="Finanças" titulo={<>Finanças <em>pessoais</em></>} lead="Estudar com as contas em ordem tira um peso da cabeça. Estas ferramentas ajudam." />
        <div className="ex-box destaque">
          <div className="ex-box-head">
            <span className="ex-icon"><Wallet size={22} aria-hidden /></span>
            <div>
              <p className="ex-kicker">App do CPPEM</p>
              <h2>Domínio Financeiro</h2>
            </div>
          </div>
          <p className="ex-text">
            Organize seu dinheiro sem planilha e sem a dúvida de por onde começar. Basta preencher as informações com
            constância e o app mostra para onde vai cada real.
          </p>
          <ul className="ex-features">{RECURSOS.map(({ Icone, texto }) => <li key={texto}><Icone size={16} aria-hidden /> {texto}</li>)}</ul>
          <div className="ex-actions">
            <a href={LINKS.dominioFinanceiro} target="_blank" rel="noreferrer" className="gold-button"><ExternalLink size={16} aria-hidden /> Abrir o Domínio Financeiro</a>
          </div>
        </div>

        <h2 className="eyebrow ex-section-label">Recomendação de leitura</h2>
        <a href={LINKS.ebook} target="_blank" rel="noreferrer" className="ex-ebook">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/extras/ebook-educacao-financeira.jpg" alt="Capa do e-book Domínio Financeiro: gerencie seu dinheiro e viva bem" width={256} height={256} />
          <span>
            <span className="ex-kicker" style={{ display: "block" }}>E-book · Educação financeira</span>
            <b>Domínio Financeiro: gerencie seu dinheiro e viva bem</b>
            <span className="ex-text" style={{ display: "block" }}>Um guia prático para transformar sua relação com o dinheiro e caminhar rumo à liberdade financeira.</span>
            <span className="gold-button" style={{ marginTop: "1rem" }}><BookOpen size={16} aria-hidden /> Quero o e-book</span>
          </span>
        </a>
      </div>
    </section>
  );
}
