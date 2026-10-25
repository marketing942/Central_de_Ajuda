"use client";

import { useState } from "react";
import { LocateFixed, MapPin, Navigation } from "lucide-react";
import { rotaUrl, SELFIT_SITE, type Unidade } from "@/lib/extras/dados";

type Estado =
  | { fase: "parado" }
  | { fase: "buscando" }
  | { fase: "erro"; mensagem: string }
  | { fase: "pronto"; lista: (Unidade & { km: number })[] };

/** Distância em km entre dois pontos (fórmula de Haversine). */
function km(lat1: number, lng1: number, lat2: number, lng2: number) {
  const r = (g: number) => (g * Math.PI) / 180;
  const a = Math.sin(r(lat2 - lat1) / 2) ** 2 + Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(r(lng2 - lng1) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

const fmtKm = (d: number) => (d < 1 ? `${Math.round(d * 1000)} m` : `${d.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km`);

export function MaisPerto() {
  const [estado, setEstado] = useState<Estado>({ fase: "parado" });

  function buscar() {
    if (!("geolocation" in navigator)) {
      setEstado({ fase: "erro", mensagem: "Este navegador não informa a localização." });
      return;
    }
    setEstado({ fase: "buscando" });
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const unidades: Unidade[] = await (await fetch("/extras/selfit-unidades.json")).json();
          const lista = unidades
            .map((u) => ({ ...u, km: km(coords.latitude, coords.longitude, u.lat, u.lng) }))
            .sort((a, b) => a.km - b.km)
            .slice(0, 3);
          setEstado({ fase: "pronto", lista });
        } catch {
          setEstado({ fase: "erro", mensagem: "Não consegui carregar as unidades agora. Tente de novo." });
        }
      },
      (erro) =>
        setEstado({
          fase: "erro",
          mensagem:
            erro.code === erro.PERMISSION_DENIED
              ? "Para achar a mais perto, permita o acesso à localização no navegador."
              : "Não consegui pegar sua localização. Tente de novo.",
        }),
      { enableHighAccuracy: false, timeout: 15_000, maximumAge: 300_000 },
    );
  }

  return (
    <section className="ex-box destaque" aria-live="polite">
      <div className="ex-local-top">
        <div>
          <h2>Qual Selfit fica mais perto?</h2>
          <p className="ex-note">Usamos sua localização só aqui, para comparar com as unidades do Brasil.</p>
        </div>
        <button type="button" onClick={buscar} disabled={estado.fase === "buscando"} className="gold-button">
          <LocateFixed size={16} aria-hidden />
          {estado.fase === "buscando" ? "Procurando…" : "Encontrar a Selfit mais perto de mim"}
        </button>
      </div>

      {estado.fase === "erro" && (
        <p className="ex-erro">
          {estado.mensagem}{" "}
          <a href={SELFIT_SITE} target="_blank" rel="noreferrer">
            Ver todas as unidades no site da Selfit
          </a>
          .
        </p>
      )}

      {estado.fase === "pronto" && (
        <ol className="ex-list" style={{ marginTop: "1.1rem" }}>
          {estado.lista.map((u, i) => (
            <li key={u.url} className={`ex-unidade${i === 0 ? " primeira" : ""}`}>
              <p className="ex-kicker">
                {i === 0 ? "A mais perto" : `${i + 1}ª opção`} · {fmtKm(u.km)}
              </p>
              <h3>
                Selfit {u.nome}
                {u.emBreve && <span className="ex-note"> (em breve)</span>}
              </h3>
              <p className="ex-endereco">
                <MapPin size={14} aria-hidden />
                <span>
                  {u.endereco} · {u.cidade}/{u.uf}
                </span>
              </p>
              <div className="ex-actions">
                <a href={rotaUrl(u)} target="_blank" rel="noreferrer" className="gold-button">
                  <Navigation size={16} aria-hidden /> Como chegar
                </a>
                <a href={u.url} target="_blank" rel="noreferrer" className="ghost-button">
                  Ver unidade
                </a>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
