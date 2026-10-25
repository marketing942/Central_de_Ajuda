import { LINKS } from "@/lib/extras/dados";

// Cartões da página /extras. "externo" abre outro site em nova aba.
export type ItemExtra = { href: string; titulo: string; texto: string; icone: string; presencial?: boolean; externo?: boolean };

export const ITENS_EXTRAS: ItemExtra[] = [
  { href: "/extras/wifi", titulo: "Wi-Fi", texto: "Rede e QR Code para se conectar na sede do CPPEM.", icone: "wifi", presencial: true },
  { href: "/extras/food-service", titulo: "Food Service", texto: "Restaurante parceiro, cantinas do prédio e apps de delivery.", icone: "food", presencial: true },
  { href: "/extras/academia", titulo: "Academia", texto: "Plano especial na Selfit e a unidade mais perto de você.", icone: "gym" },
  { href: LINKS.saude, titulo: "Saúde", texto: "CPPEM Saúde: bem-estar e conquistas na sua rotina.", icone: "health", externo: true },
  { href: "/extras/financas", titulo: "Finanças", texto: "App Domínio Financeiro e o e-book de educação financeira.", icone: "wallet" },
  { href: "/extras/metas", titulo: "Metas e organização", texto: "App Life Board: metas, rotina de treino, anotações e evolução.", icone: "goals" },
  { href: "/extras/educacao", titulo: "Educação", texto: "Supletivo, faculdade EAD e colégio, com condições para alunos.", icone: "school" },
  { href: LINKS.parceiros, titulo: "Parceiros", texto: "Rede de parceiros com benefícios e descontos para alunos.", icone: "partners", externo: true },
];
