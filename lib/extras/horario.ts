"use client";

import { useSyncExternalStore } from "react";
import type { Janela } from "@/lib/extras/dados";

// Relógio de Recife que atualiza a cada 30s. No servidor devolve null: o selo só aparece no navegador
// (o horário do build seria o errado).

let agora = 0;
const ouvintes = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function assinar(fn: () => void) {
  ouvintes.add(fn);
  if (!timer) {
    agora = Date.now();
    timer = setInterval(() => {
      agora = Date.now();
      ouvintes.forEach((f) => f());
    }, 30_000);
  }
  return () => {
    ouvintes.delete(fn);
    if (!ouvintes.size && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

export function useAgora(): number | null {
  return useSyncExternalStore(
    assinar,
    () => agora || (agora = Date.now()),
    () => null,
  );
}

const DIAS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

/** Dia da semana (0-6) e minutos desde a meia-noite, no fuso de Recife. */
function emRecife(ms: number) {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Recife",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(ms));
  const get = (t: string) => partes.find((p) => p.type === t)?.value ?? "";
  const dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { dia, min: Number(get("hour")) * 60 + Number(get("minute")) };
}

const minutos = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const hora = (hhmm: string) => hhmm.replace(/^0/, "").replace(":00", "h").replace(":", "h");

export type Status = { aberto: boolean; texto: string };

export function statusAgora(janelas: Janela[], ms: number): Status {
  const { dia, min } = emRecife(ms);
  for (const j of janelas) {
    if (j.dias.includes(dia) && min >= minutos(j.inicio) && min < minutos(j.fim)) {
      return { aberto: true, texto: `até ${hora(j.fim)}` };
    }
  }
  // próxima abertura nos próximos 7 dias
  for (let d = 0; d < 8; d++) {
    const diaAlvo = (dia + d) % 7;
    const candidatas = janelas
      .filter((j) => j.dias.includes(diaAlvo) && (d > 0 || minutos(j.inicio) > min))
      .sort((a, b) => minutos(a.inicio) - minutos(b.inicio));
    if (candidatas.length) {
      const quando = d === 0 ? "hoje" : d === 1 ? "amanhã" : DIAS[diaAlvo];
      return { aberto: false, texto: `abre ${quando} às ${hora(candidatas[0].inicio)}` };
    }
  }
  return { aberto: false, texto: "" };
}
