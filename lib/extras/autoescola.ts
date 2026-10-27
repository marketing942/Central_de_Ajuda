// Parceria CPPEM × Autoescola Dirija+ (CNH AB: carro e moto). Valores da proposta da autoescola e
// das taxas do Detran-PE, conforme o material enviado pela parceria. Mesmos dados da área da equipe
// (Utilitários CPPEM): se mudarem, atualize nos dois lugares.

export const AUTOESCOLA = {
  nome: "Autoescola Dirija+",
  endereco: "Rua Maria Merandolina, 56, Riachão, Caruaru - PE",
  whatsapp: { label: "(81) 99608-6918", url: "https://api.whatsapp.com/send?phone=5581996086918" },
  instagram: { label: "@autoescola.dirijamais", url: "https://www.instagram.com/autoescola.dirijamais" },
  mapa: "https://www.google.com/maps/search/?api=1&query=Rua%20Maria%20Merandolina%2056%20Riach%C3%A3o%20Caruaru%20PE",
  aulaDuracao: "Cada aula dura 50 minutos.",
};

export type Item = { nome: string; detalhe?: string; valor: string; oficial?: boolean };

export const PACOTE: Item = {
  nome: "Pacote completo AB",
  detalhe:
    "Abertura do processo e foto, agendamento dos exames médico e psicológico, prova teórica no CFC, 2 aulas de carro, 2 aulas de moto, agendamento da prova prática e orientação sobre o toxicológico",
  valor: "R$ 660,00",
};

export const AVULSOS: Item[] = [
  { nome: "Acompanhamento do processo", valor: "R$ 150,00" },
  { nome: "Abertura do processo e foto", valor: "R$ 100,00" },
  { nome: "Prova teórica no CFC", valor: "R$ 100,00" },
  { nome: "2 aulas práticas de carro", valor: "R$ 180,00" },
  { nome: "2 aulas práticas de moto", valor: "R$ 180,00" },
  { nome: "Aula prática extra (carro ou moto)", valor: "R$ 50,00" },
  { nome: "Exame toxicológico", valor: "R$ 100,00" },
  { nome: "Agendamento de prova no Detran de Caruaru", valor: "R$ 50,00" },
  {
    nome: "Aluguel da moto Honda Biz",
    detalhe: "Opcional: só se o aluno fizer a prova na Biz. O Detran fornece carro e moto no dia da prova.",
    valor: "R$ 150,00",
  },
];

export const SO_AULAS: Item = {
  nome: "Só aulas práticas: 2 de carro + 2 de moto",
  detalhe: "Você cuida das demais etapas",
  valor: "R$ 360,00",
};

export const NOTA_AULAS =
  "O Detran exige no mínimo 2 aulas monitoradas de cada categoria para liberar a prova prática. Pagamento à vista ou por etapa.";

export const DETRAN: Item[] = [
  { nome: "Exame de aptidão física e mental", detalhe: "Clínica credenciada", valor: "R$ 107,77", oficial: true },
  { nome: "Avaliação psicológica", detalhe: "Clínica credenciada", valor: "R$ 132,61", oficial: true },
  { nome: "Permissão para Dirigir AB", detalhe: "Taxa do Detran-PE", valor: "R$ 283,49", oficial: true },
];
export const DETRAN_TOTAL = "R$ 523,87";

export const NOTA_DETRAN =
  "Valores da consulta oficial de taxas do Detran-PE. O Detran-PE anunciou redução dos exames médico e psicológico em 24/02/2026 (para R$ 80,70 e R$ 99,30): confirme com a clínica qual valor está sendo cobrado. Em caso de reprovação em prova, pode haver nova taxa.";

export const RESUMO = [
  { opcao: "Pacote completo", autoescola: "R$ 660,00", detran: "R$ 523,87", total: "R$ 1.183,87" },
  { opcao: "Só aulas práticas", autoescola: "R$ 360,00", detran: "R$ 523,87", total: "R$ 883,87" },
];

export const NOTA_RESUMO =
  "Opcionais, se quiser: exame toxicológico (R$ 100,00), aluguel da moto Biz (R$ 150,00) e aulas extras (R$ 50,00 cada). Na opção só aulas, você cuida sozinho das demais etapas.";
