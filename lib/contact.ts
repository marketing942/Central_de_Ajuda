import "server-only";

// Canais oficiais exibidos em "Ainda precisa de ajuda?". Lidos em runtime:
// dá para preencher no Portainer sem rebuild. Canal vazio simplesmente não
// aparece.

export type ContactChannels = {
  whatsappUrl: string | null;
  email: string | null;
  hours: string | null;
};

function safeHttps(value: string | undefined) {
  if (!value) return null;
  try {
    return new URL(value).protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}

export function getContactChannels(): ContactChannels {
  const email = process.env.SUPORTE_EMAIL?.trim();
  return {
    whatsappUrl: safeHttps(process.env.SUPORTE_WHATSAPP_URL?.trim()),
    email: email && email.includes("@") ? email : null,
    hours: process.env.SUPORTE_HORARIO?.trim() || null,
  };
}

export const MAIN_SITE_URL = process.env.CPPEM_SITE_URL?.trim() || "https://cppem.com.br";
