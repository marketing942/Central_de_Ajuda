import type { Metadata } from "next";
import { Inter, Oxanium, Rajdhani } from "next/font/google";
import { EmberField } from "@/components/ember-field";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import "./globals.css";

const inter = Inter({ variable: "--font-body", subsets: ["latin"] });
const oxanium = Oxanium({ variable: "--font-display", subsets: ["latin"] });
const rajdhani = Rajdhani({ variable: "--font-ui", subsets: ["latin"], weight: ["500", "600", "700"] });

// Renderiza a cada requisição: o conteúdo do Notion fica em cache (5 min) na
// camada de dados, e as variáveis de ambiente (canais de contato) valem em
// runtime, sem precisar de rebuild da imagem.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://central-de-ajuda.cppem.com.br"),
  title: { default: "Central de Ajuda CPPEM", template: "%s | Central de Ajuda CPPEM" },
  description: "Orientações oficiais do CPPEM: plataforma, turmas, mentoria, materiais e pagamentos.",
  applicationName: "Central de Ajuda CPPEM",
  openGraph: { title: "Central de Ajuda CPPEM", description: "Como podemos te ajudar?", type: "website", locale: "pt_BR" },
};

export default function RootLayout({ children, modal }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${oxanium.variable} ${rajdhani.variable}`}>
      <body>
        <div className="page-shell">
          <EmberField />
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
        {modal}
      </body>
    </html>
  );
}
