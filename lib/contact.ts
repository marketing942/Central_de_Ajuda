import "server-only";
import { isWithinHours } from "@/lib/hours";

// Canais oficiais exibidos em "Ainda precisa de ajuda?". Os links são
// redirecionadores do links.cppem.com.br: trocar o número do WhatsApp é feito
// lá, sem mexer aqui.

export type SupportChannel = {
  id: string;
  kind: "ai" | "team";
  title: string;
  description: string;
  hoursLabel: string;
  cta: string;
  href: string;
  /** Horário de atendimento (Brasília). null = 24 horas. */
  hours: { open: number; close: number } | null;
};

export const SUPPORT_CHANNELS: SupportChannel[] = [
  {
    id: "assistente",
    kind: "ai",
    title: "Assistente virtual",
    description: "Atendimento com IA para tirar dúvidas na hora, a qualquer momento.",
    hoursLabel: "24 horas, todos os dias",
    cta: "Falar com a assistente",
    href: "https://links.cppem.com.br/suporte-cppem-ass",
    hours: null,
  },
  {
    id: "equipe",
    kind: "team",
    title: "Suporte ao aluno",
    description: "Fale com a equipe CPPEM. Envie nome completo, turma ou produto e a sua dúvida.",
    hoursLabel: "Das 12h às 22h",
    cta: "Falar com a equipe",
    href: "https://links.cppem.com.br/cppem-suporte-aluno",
    hours: { open: 12, close: 22 },
  },
];

/** true/false para canais com horário; null para 24h. Calculado no servidor a cada requisição. */
export function isChannelOpen(channel: SupportChannel, now = new Date()): boolean | null {
  if (!channel.hours) return null;
  return isWithinHours(channel.hours, now);
}

export function getSupportEmail(): string | null {
  const email = process.env.SUPORTE_EMAIL?.trim();
  return email && email.includes("@") ? email : null;
}

export const MAIN_SITE_URL = process.env.CPPEM_SITE_URL?.trim() || "https://cppem.com.br";
