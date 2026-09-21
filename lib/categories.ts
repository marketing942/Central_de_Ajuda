// Aparência de cada categoria (opção do select "Categoria" no Notion).
//
// As categorias em si vêm do Notion: criar uma opção nova lá já gera o card
// no site, na mesma ordem das opções do select. Este mapa só define ícone e
// descrição; categoria nova sem entrada aqui usa o FALLBACK. A chave é o nome
// normalizado (sem acento, minúsculo), então "Plataforma CPPEM" e
// "Plataforma Cppem" batem com a mesma entrada.

import { normalizeText } from "@/lib/slug";

export type CategoryIcon =
  | "help" | "monitor" | "users" | "compass" | "file" | "package" | "card" | "book";

type CategoryMeta = { icon: CategoryIcon; description: string };

const META: Record<string, CategoryMeta> = {
  "duvidas gerais": {
    icon: "help",
    description: "Primeiros passos, funcionamento da central e as perguntas mais comuns sobre o CPPEM.",
  },
  "plataforma cppem": {
    icon: "monitor",
    description: "Acesso, login, aulas, questões e recursos da plataforma de estudos.",
  },
  "turma presencial": {
    icon: "users",
    description: "Rotina, horários, frequência e orientações das turmas presenciais.",
  },
  mentoria: {
    icon: "compass",
    description: "Encontros, acompanhamento e direção de estudos da mentoria.",
  },
  "materiais digitais": {
    icon: "file",
    description: "Apostilas, PDFs, downloads e acesso aos materiais digitais.",
  },
  "materiais fisicos": {
    icon: "package",
    description: "Envio, prazos de entrega, rastreio e trocas de materiais impressos.",
  },
  pagamentos: {
    icon: "card",
    description: "Formas de pagamento, boletos, parcelamento, reembolso e cancelamento.",
  },
};

const FALLBACK: CategoryMeta = {
  icon: "book",
  description: "Orientações oficiais do CPPEM sobre este assunto.",
};

export function categoryMeta(name: string): CategoryMeta {
  return META[normalizeText(name)] ?? FALLBACK;
}
