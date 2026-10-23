import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, Database, LockKeyhole, SearchCheck, ShieldCheck } from "lucide-react";
import { PhoneChecker } from "@/components/phone-checker";
import "./confirma.css";

export const metadata: Metadata = {
  title: "Confirmar número oficial",
  description: "Confirme se um número de WhatsApp ou telefone pertence oficialmente à equipe CPPEM.",
  alternates: { canonical: "/confirma" },
};

export default function ConfirmaPage() {
  return (
    <div className="cf-page">
      <section className="cf-hero" aria-labelledby="confirma-titulo">
        <div className="cf-hero-grid" aria-hidden="true" />
        <div className="cf-orbit cf-orbit-one" aria-hidden="true" />
        <div className="cf-orbit cf-orbit-two" aria-hidden="true" />
        <div className="container cf-hero-content">
          <div className="cf-hero-copy">
            <span className="eyebrow"><ShieldCheck size={15} /> Canal oficial de verificação</span>
            <h1 id="confirma-titulo">Antes de responder,<br /><span>confirme o número.</span></h1>
            <p>Recebeu uma mensagem em nome do CPPEM? Digite o telefone e descubra, em poucos segundos, se ele pertence à nossa equipe.</p>
            <div className="cf-trust-row">
              <span><LockKeyhole size={17} /> Consulta privada</span>
              <span><BadgeCheck size={17} /> Base oficial CPPEM</span>
            </div>
          </div>
          <PhoneChecker />
        </div>
      </section>

      <section className="cf-how" id="como-funciona" aria-label="Como funciona">
        <div className="container">
          <div className="cf-section-heading">
            <span className="eyebrow">Proteção em três passos</span>
            <h2>Uma checagem simples.<br /><span>Uma decisão mais segura.</span></h2>
          </div>
          <div className="cf-steps-grid">
            <article><span className="cf-step-number">01</span><div className="cf-step-icon"><SearchCheck size={25} /></div><h3>Digite o número</h3><p>Informe o telefone completo, com DDD. Você pode colar com ou sem espaços e pontuação.</p></article>
            <article><span className="cf-step-number">02</span><div className="cf-step-icon"><Database size={25} /></div><h3>Consulte a base</h3><p>O sistema compara o telefone com o cadastro oficial de canais ativos do CPPEM.</p></article>
            <article><span className="cf-step-number">03</span><div className="cf-step-icon"><ShieldCheck size={25} /></div><h3>Veja o resultado</h3><p>Você recebe uma confirmação clara para continuar a conversa ou interromper o contato.</p></article>
          </div>
        </div>
      </section>

      <section className="cf-alert-section" aria-label="Atenção contra golpes">
        <div className="container cf-alert-card">
          <Image src="/brand/emblema-leao.webp" width={84} height={84} alt="" />
          <div>
            <span className="eyebrow">Atenção contra golpes</span>
            <h2>A CPPEM nunca solicita senhas ou códigos de acesso.</h2>
            <p>Mesmo quando o número for confirmado, não compartilhe senhas, códigos recebidos por SMS ou dados completos do cartão.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
