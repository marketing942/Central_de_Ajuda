import Image from "next/image";
import Link from "next/link";
import { Bot, Clock, Headset, Mail, MessageCircle, Sparkles } from "lucide-react";
import { channelReturnLabel, getSupportEmail, isChannelOpen, SUPPORT_CHANNELS, type SupportChannel } from "@/lib/contact";
import { ScamAlert } from "@/components/scam-alert";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="brand" aria-label="Central de Ajuda CPPEM — início">
          <Image src="/brand/logo-cppem.png" alt="CPPEM" width={700} height={253} priority />
          <span className="brand-divider" aria-hidden />
          <span className="brand-label">Central de Ajuda</span>
        </Link>
        <Link href="/extras" className="header-extras">
          <Sparkles size={15} aria-hidden /> Extras
        </Link>
      </div>
    </header>
  );
}

function ChannelStatus({ channel }: { channel: SupportChannel }) {
  const open = isChannelOpen(channel);
  if (open === null) return <span className="channel-status online">Sempre disponível</span>;
  return open ? (
    <span className="channel-status online">Disponível agora</span>
  ) : (
    <span className="channel-status offline">{channelReturnLabel(channel)}</span>
  );
}

function ChannelCard({ channel, compact = false }: { channel: SupportChannel; compact?: boolean }) {
  const Icon = channel.kind === "ai" ? Bot : Headset;
  return (
    <article className={`channel-card${compact ? " compact" : ""}`}>
      <header>
        <span className="channel-icon">
          <Icon size={compact ? 20 : 24} aria-hidden />
        </span>
        <div>
          <h3>{channel.title}</h3>
          <p className="channel-hours">
            <Clock size={14} aria-hidden /> {channel.hoursLabel}
          </p>
          <ChannelStatus channel={channel} />
        </div>
      </header>
      {!compact && <p className="channel-description">{channel.description}</p>}
      <a className="whatsapp-button" href={channel.href} target="_blank" rel="noreferrer">
        <MessageCircle size={18} aria-hidden /> {channel.cta}
      </a>
    </article>
  );
}

export function ContactSection() {
  const email = getSupportEmail();
  return (
    <section className="contact-section" id="atendimento" aria-labelledby="contato-titulo">
      <div className="container contact-inner">
        <span className="eyebrow">Atendimento</span>
        <h2 id="contato-titulo" className="section-title">Ainda precisa de ajuda?</h2>
        <p className="section-copy">Escolha como prefere falar com o CPPEM pelo WhatsApp.</p>
        <div className="channel-grid">
          {SUPPORT_CHANNELS.map((channel) => <ChannelCard key={channel.id} channel={channel} />)}
        </div>
        <ScamAlert as="h3" id="golpes-contato-titulo" />
        {email && (
          <a className="contact-email" href={`mailto:${email}`}>
            <Mail size={16} aria-hidden /> ou escreva para {email}
          </a>
        )}
      </div>
    </section>
  );
}

/** Versão curta para o fim do popup do artigo. */
export function ContactInline() {
  return (
    <aside className="contact-inline" aria-labelledby="contato-popup-titulo">
      <h2 id="contato-popup-titulo">Ainda precisa de ajuda?</h2>
      <div className="channel-grid">
        {SUPPORT_CHANNELS.map((channel) => <ChannelCard key={channel.id} channel={channel} compact />)}
      </div>
    </aside>
  );
}
