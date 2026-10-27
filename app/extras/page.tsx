import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CarFront, Dumbbell, Handshake, MapPin, School, UtensilsCrossed, Wifi } from "lucide-react";
import { ExtrasHead } from "@/components/extras/extras-head";
import { ContactSection } from "@/components/site-chrome";
import { ITENS_EXTRAS } from "@/lib/extras/itens";
import { openGraphFor } from "@/lib/seo";
import "./extras.css";

const description = "Wi-Fi, alimentação, academia, autoescola, educação e parceiros: serviços e benefícios do CPPEM além das aulas.";

export const metadata: Metadata = {
  title: "Extras para alunos",
  description,
  alternates: { canonical: "/extras" },
  openGraph: openGraphFor({ title: "Extras para alunos | Central de Ajuda CPPEM", description, path: "/extras" }),
};

const ICONES = { wifi: Wifi, food: UtensilsCrossed, gym: Dumbbell, car: CarFront, school: School, partners: Handshake };

export default function ExtrasPage() {
  return (
    <>
      <section className="ex-page">
        <div className="container">
          <ExtrasHead
            titulo={<>Além das <em>aulas</em></>}
            lead="Serviços e benefícios que facilitam sua vida dentro e fora do CPPEM."
          />
          <ul className="ex-grid" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {ITENS_EXTRAS.map((item) => {
              const Icone = ICONES[item.icone as keyof typeof ICONES];
              const conteudo = (
                <>
                  <span className="ex-card-icon"><Icone size={22} aria-hidden /></span>
                  <span className="ex-card-copy">
                    <strong>
                      {item.titulo}
                      {item.externo && <ArrowUpRight size={16} aria-label="abre em nova aba" />}
                    </strong>
                    <p>{item.texto}</p>
                    {item.presencial && (
                      <span className="ex-tag"><MapPin size={11} aria-hidden /> Presencial</span>
                    )}
                  </span>
                </>
              );
              return (
                <li key={item.href}>
                  {item.externo ? (
                    <a href={item.href} target="_blank" rel="noreferrer" className="ex-card">{conteudo}</a>
                  ) : (
                    <Link href={item.href} className="ex-card">{conteudo}</Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <ContactSection />
    </>
  );
}
