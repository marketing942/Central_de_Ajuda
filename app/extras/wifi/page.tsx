import type { Metadata } from "next";
import QRCode from "qrcode";
import { ExtrasHead } from "@/components/extras/extras-head";
import { Copiar } from "@/components/extras/copiar";
import { WIFI_VISITANTES, wifiQrPayload } from "@/lib/extras/dados";
import "../extras.css";

export const metadata: Metadata = {
  title: "Wi-Fi na sede",
  description: "Rede Wi-Fi e QR Code para alunos e visitantes na sede do CPPEM.",
  alternates: { canonical: "/extras/wifi" },
};

export default async function WifiPage() {
  const qr = await QRCode.toString(wifiQrPayload(WIFI_VISITANTES.nome, WIFI_VISITANTES.senha), { type: "svg", margin: 0, errorCorrectionLevel: "M" });
  return (
    <section className="ex-page">
      <div className="container" style={{ maxWidth: 900 }}>
        <ExtrasHead crumb="Wi-Fi" titulo={<>Wi-Fi <em>na sede</em></>} lead="Está na sede do CPPEM? Conecte-se à rede de alunos e visitantes." />
        <div className="ex-box destaque">
          <p className="ex-kicker">Rede para alunos e visitantes · presencial</p>
          <div className="ex-wifi">
            <div>
              <p className="ex-note" style={{ margin: 0 }}>Nome da rede</p>
              <p className="ex-wifi-value">{WIFI_VISITANTES.nome}</p>
              <Copiar valor={WIFI_VISITANTES.nome} rotulo="Copiar nome" />
              <p className="ex-note" style={{ marginTop: "1.2rem" }}>Senha</p>
              <p className="ex-wifi-value senha">{WIFI_VISITANTES.senha}</p>
              <Copiar valor={WIFI_VISITANTES.senha} rotulo="Copiar senha" />
            </div>
            <figure className="ex-qr" style={{ margin: 0 }}>
              <div role="img" aria-label={`QR Code para conectar na rede ${WIFI_VISITANTES.nome}`} dangerouslySetInnerHTML={{ __html: qr }} />
              <figcaption>Aponte a câmera do celular para se conectar</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
