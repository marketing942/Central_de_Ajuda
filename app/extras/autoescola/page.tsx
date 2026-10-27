import type { Metadata } from "next";
import { ExternalLink, MapPin, MessageCircle } from "lucide-react";
import { ExtrasHead } from "@/components/extras/extras-head";
import { SocialIcon } from "@/components/social-icons";
import {
  AUTOESCOLA as A,
  AVULSOS,
  DETRAN,
  DETRAN_TOTAL,
  NOTA_AULAS,
  NOTA_DETRAN,
  NOTA_RESUMO,
  PACOTE,
  RESUMO,
  SO_AULAS,
  type Item,
} from "@/lib/extras/autoescola";
import "../extras.css";

export const metadata: Metadata = {
  title: "Autoescola Dirija+",
  description: "Parceria do CPPEM com a Autoescola Dirija+ para tirar a CNH AB (carro e moto), com os valores da autoescola e do Detran-PE.",
  alternates: { canonical: "/extras/autoescola" },
};

function Linha({ item }: { item: Item }) {
  return (
    <li className="ex-linha">
      <div>
        <p className="ex-linha-nome">
          {item.nome}
          {item.oficial && <span className="ex-tag" style={{ marginLeft: ".5rem", marginTop: 0 }}>oficial</span>}
        </p>
        {item.detalhe && <p className="ex-note" style={{ marginTop: ".2rem" }}>{item.detalhe}</p>}
      </div>
      <p className="ex-linha-valor">{item.valor}</p>
    </li>
  );
}

const Sub = ({ children }: { children: string }) => <li className="ex-linha-sub">{children}</li>;

function Bloco({ titulo, descricao, children, nota }: { titulo: string; descricao?: string; children: React.ReactNode; nota: string }) {
  return (
    <section className="ex-tabela">
      <header>
        <h2>{titulo}</h2>
        {descricao && <p className="ex-note" style={{ margin: 0 }}>{descricao}</p>}
      </header>
      <ul>{children}</ul>
      <p className="ex-tabela-nota">{nota}</p>
    </section>
  );
}

export default function AutoescolaPage() {
  return (
    <section className="ex-page">
      <div className="container" style={{ maxWidth: 900 }}>
        <ExtrasHead crumb="Autoescola" titulo={<>CNH AB com a <em>Dirija+</em></>} />

        <div className="ex-box destaque ex-hero-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/extras/dirija-logo.jpg" alt="Logomarca da Autoescola Dirija+" width={150} height={150} />
          <div>
            <p className="ex-kicker">Parceria CPPEM × Autoescola Dirija+</p>
            <h2 style={{ marginTop: ".3rem", fontSize: "1.6rem" }}>Tire sua CNH de carro e moto</h2>
            <p className="ex-text">
              Benefício para alunos e colaboradores do CPPEM: a Autoescola Dirija+ cuida do processo da sua CNH AB, em Caruaru,
              com pacote completo ou só as aulas práticas.
            </p>
          </div>
        </div>
        <div className="ex-actions">
          <a href={A.whatsapp.url} target="_blank" rel="noreferrer" className="gold-button"><MessageCircle size={16} aria-hidden /> Falar no WhatsApp</a>
          <a href={A.instagram.url} target="_blank" rel="noreferrer" className="ghost-button"><SocialIcon name="instagram" /> {A.instagram.label}</a>
          <a href={A.mapa} target="_blank" rel="noreferrer" className="ghost-button"><MapPin size={16} aria-hidden /> Ver no mapa</a>
        </div>
        <p className="ex-note">{A.nome} · {A.endereco} · WhatsApp {A.whatsapp.label}</p>

        <Bloco titulo="Autoescola Dirija+" descricao={`Valores da proposta da autoescola. ${A.aulaDuracao}`} nota={NOTA_AULAS}>
          <Sub>Pacote completo</Sub>
          <Linha item={PACOTE} />
          <Sub>Serviços avulsos</Sub>
          {AVULSOS.map((item) => <Linha key={item.nome} item={item} />)}
          <Sub>Só aulas práticas</Sub>
          <Linha item={SO_AULAS} />
        </Bloco>

        <Bloco titulo="Detran-PE" descricao="Primeira habilitação AB. Valores pagos por fora da autoescola." nota={NOTA_DETRAN}>
          {DETRAN.map((item) => <Linha key={item.nome} item={item} />)}
          <Linha item={{ nome: "Total dos itens acima", valor: DETRAN_TOTAL }} />
        </Bloco>

        <Bloco titulo="Quanto você paga no total" descricao="Soma da autoescola com os itens do Detran-PE." nota={NOTA_RESUMO}>
          {RESUMO.map((r) => (
            <li key={r.opcao} className="ex-linha ex-linha-resumo">
              <div>
                <p className="ex-linha-nome">{r.opcao}</p>
                <p className="ex-note" style={{ marginTop: ".2rem" }}>Autoescola {r.autoescola} + Detran-PE {r.detran}</p>
              </div>
              <p className="ex-linha-valor grande">{r.total}</p>
            </li>
          ))}
        </Bloco>

        <div className="ex-actions">
          <a href={A.whatsapp.url} target="_blank" rel="noreferrer" className="gold-button"><ExternalLink size={16} aria-hidden /> Quero saber mais</a>
        </div>
      </div>
    </section>
  );
}
