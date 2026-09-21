import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, Mail, MessageCircle } from "lucide-react";
import { getContactChannels, MAIN_SITE_URL } from "@/lib/contact";

export function SiteHeader() {
  const { whatsappUrl } = getContactChannels();
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="brand" aria-label="Central de Ajuda CPPEM — início">
          <Image src="/brand/logo-cppem.png" alt="CPPEM" width={700} height={253} priority />
          <span className="brand-divider" aria-hidden />
          <span className="brand-label">Central de Ajuda</span>
        </Link>
        <nav className="header-actions" aria-label="Atalhos">
          <a className="header-link" href={MAIN_SITE_URL}>
            cppem.com.br <ArrowUpRight size={14} />
          </a>
          {whatsappUrl && (
            <a className="whatsapp-button compact" href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={16} /> <span>WhatsApp</span>
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}

export function ContactSection() {
  const { whatsappUrl, email, hours } = getContactChannels();
  const hasChannel = Boolean(whatsappUrl || email);

  return (
    <section className="contact-section" aria-labelledby="contato-titulo">
      <div className="container contact-inner">
        <span className="eyebrow">Atendimento</span>
        <h2 id="contato-titulo" className="section-title">Ainda precisa de ajuda?</h2>
        <p className="section-copy">
          {hasChannel
            ? "Fale com a equipe CPPEM. Para agilizar, envie seu nome completo, turma ou produto contratado e uma descrição objetiva da dúvida."
            : "Os canais oficiais de atendimento serão divulgados aqui em breve."}
        </p>
        <div className="contact-actions">
          {whatsappUrl ? (
            <a className="whatsapp-button large" href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={20} /> Falar no WhatsApp
            </a>
          ) : (
            // Sem SUPORTE_WHATSAPP_URL o botão aparece desativado, para o
            // layout já ficar pronto enquanto o número não é definido.
            <span className="whatsapp-button large" aria-disabled="true">
              <MessageCircle size={20} /> WhatsApp em breve
            </span>
          )}
          {email && (
            <a className="ghost-button" href={`mailto:${email}`}>
              <Mail size={18} /> {email}
            </a>
          )}
        </div>
        {hours && (
          <p className="contact-hours">
            <Clock size={16} /> {hours}
          </p>
        )}
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <span>© {new Date().getFullYear()} CPPEM Concursos Públicos · Caruaru — Pernambuco</span>
        <a href={MAIN_SITE_URL}>Voltar para cppem.com.br</a>
      </div>
    </footer>
  );
}
