import Image from "next/image";
import Link from "next/link";
import { ArrowUp, ArrowUpRight, Bot, Headset, MapPin } from "lucide-react";
import { CategoryIcon } from "@/components/category-icon";
import { SOCIAL_LINKS, SocialIcon } from "@/components/social-icons";
import { channelReturnLabel, isChannelOpen, MAIN_SITE_URL, SUPPORT_CHANNELS } from "@/lib/contact";
import { getHelpCenter } from "@/lib/notion/help-center";

const siteLinks = [
  ["Quem somos", "/quem-somos"],
  ["Cursos", "/cursos"],
  ["Plano de combate", "/plano-de-combate"],
  ["Presencial", "/presencial"],
  ["Materiais gratuitos", "/materiais-gratuitos"],
  ["Loja", "https://cppem.lojaintegrada.com.br"],
] as const;

function siteHref(path: string) {
  return path.startsWith("http") ? path : `${MAIN_SITE_URL}${path}`;
}

export async function SiteFooter() {
  const { categories } = await getHelpCenter();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-crest" aria-hidden>
        <span className="footer-crest-line" />
        <span className="footer-crest-badge">
          <Image src="/brand/emblema-leao.webp" alt="" width={400} height={465} />
        </span>
        <span className="footer-crest-line" />
      </div>

      <div className="container footer-grid">
        <div className="footer-brand">
          <Image src="/brand/logo-cppem.png" alt="CPPEM" width={700} height={253} className="footer-logo" />
          <p>
            Orientações oficiais do CPPEM para você resolver rápido e voltar ao que importa: <strong>a sua aprovação</strong>.
          </p>
          <div className="footer-social">
            {SOCIAL_LINKS.map((social) => (
              <a key={social.key} href={social.href} target="_blank" rel="noreferrer" aria-label={`${social.label} do CPPEM`}>
                <SocialIcon name={social.key} />
              </a>
            ))}
          </div>
          <a className="footer-site-link" href={MAIN_SITE_URL}>
            Ir para o cppem.com.br <ArrowUpRight size={14} aria-hidden />
          </a>
        </div>

        {categories.length > 0 && (
          <nav className="footer-column" aria-labelledby="footer-central">
            <h2 id="footer-central">Central de Ajuda</h2>
            <ul>
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link href={`/${category.slug}`}>
                    <CategoryIcon icon={category.icon} size={15} />
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <nav className="footer-column" aria-labelledby="footer-cppem">
          <h2 id="footer-cppem">CPPEM</h2>
          <ul>
            {siteLinks.map(([label, path]) => (
              <li key={label}>
                <a href={siteHref(path)}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer-column" aria-labelledby="footer-atendimento">
          <h2 id="footer-atendimento">Atendimento</h2>
          <ul className="footer-channels">
            {SUPPORT_CHANNELS.map((channel) => {
              const open = isChannelOpen(channel);
              const Icon = channel.kind === "ai" ? Bot : Headset;
              return (
                <li key={channel.id}>
                  <a href={channel.href} target="_blank" rel="noreferrer">
                    <Icon size={18} aria-hidden />
                    <span>
                      <strong>{channel.title}</strong>
                      <small>{channel.hoursLabel}</small>
                      <em data-open={open !== false}>
                        {open === null ? "Sempre disponível" : open ? "Disponível agora" : channelReturnLabel(channel)}
                      </em>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="footer-wordmark" aria-hidden>
        CPPEM
      </div>

      <div className="container footer-bottom">
        <span>© {year} CPPEM Concursos Públicos. Todos os direitos reservados.</span>
        <span className="footer-location">
          <MapPin size={14} aria-hidden /> Caruaru — Pernambuco
        </span>
        <a href="#topo" className="footer-top">
          Voltar ao topo <ArrowUp size={14} aria-hidden />
        </a>
      </div>
    </footer>
  );
}
