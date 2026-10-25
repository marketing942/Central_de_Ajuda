// Extras para alunos e clientes: os mesmos serviços da área da equipe (Utilitários CPPEM), com os textos
// voltados para quem estuda no CPPEM. Wi-Fi: só a rede de visitantes (as redes internas não entram aqui).

export const WIFI_VISITANTES = { nome: "Cppem - 01 Visitantes", senha: "CppemWifi@Visitas123" };

export function wifiQrPayload(nome: string, senha: string) {
  const esc = (v: string) => v.replace(/([\;,:"])/g, "\\$1");
  return `WIFI:T:WPA;S:${esc(nome)};P:${esc(senha)};;`;
}

/* ---------- Food Service (presencial) ---------- */

export type Janela = { dias: number[]; inicio: string; fim: string };
export type Local = {
  id: string;
  nome: string;
  tipo: string;
  descricao: string;
  horarioTexto: string;
  janelas: Janela[];
  link?: { label: string; url: string };
};

const SEG_SEX = [1, 2, 3, 4, 5];

export const LOCAIS: Local[] = [
  {
    id: "la-cozzina",
    nome: "La Cozzina",
    tipo: "Restaurante parceiro",
    descricao: "Ótimo para almoço e marmitas, com entrega no CPPEM.",
    horarioTexto: "Pedidos das 8h às 11h · segunda a sexta",
    janelas: [{ dias: SEG_SEX, inicio: "08:00", fim: "11:00" }],
    link: { label: "Pedir pelo WhatsApp", url: "https://wa.me/5581998036171" },
  },
  {
    id: "cantina-diurna",
    nome: "Cantina diurna",
    tipo: "Lanches no prédio",
    descricao: "Cantina de lanches dentro do prédio, nos intervalos da manhã e da tarde.",
    horarioTexto: "Das 8h30 às 9h (aprox.) e das 15h30 às 16h · segunda a sexta",
    janelas: [
      { dias: SEG_SEX, inicio: "08:30", fim: "09:00" },
      { dias: SEG_SEX, inicio: "15:30", fim: "16:00" },
    ],
    link: { label: "Chamar no WhatsApp", url: "https://wa.me/5581993979592" },
  },
  {
    id: "cantina-noturna",
    nome: "Cantina noturna",
    tipo: "Lanches no prédio",
    descricao: "Cantina de lanches dentro do prédio, no intervalo da noite.",
    horarioTexto: "Das 20h20 às 22h · segunda a sexta",
    janelas: [{ dias: SEG_SEX, inicio: "20:20", fim: "22:00" }],
    link: { label: "Chamar no WhatsApp", url: "https://wa.me/5581992904051" },
  },
];

export const APPS_DELIVERY = [
  { nome: "iFood", descricao: "Delivery de restaurantes e mercados", url: "https://www.ifood.com.br/", logo: "/extras/ifood.svg" },
  { nome: "99Food", descricao: "Delivery de comida e bebidas", url: "https://99app.com/99food/", logo: "/extras/99food.svg" },
];

/* ---------- Academia (Selfit) ---------- */

export const SELFIT_SITE = "https://www.selfitacademias.com.br/unidades";

export const BENEFICIO_SELFIT = {
  plano: "Plano Plus Corporativo Selfit",
  quem: "Benefício para alunos do CPPEM, conforme as regras da Selfit.",
  mensalidade: "R$ 119,90",
  isencoes: ["Matrícula", "Anuidade", "Multa de cancelamento"],
  inclui: ["Musculação", "Funcional", "Alta intensidade", "Aulas coletivas", "Cardio"],
  abrangencia: "Vale em todas as unidades Selfit do Brasil.",
};

export type Unidade = { nome: string; endereco: string; cidade: string; uf: string; lat: number; lng: number; url: string; emBreve: boolean };

export const SELFIT_CARUARU: Unidade[] = [
  { nome: "Caruaru", endereco: "Av. Oswaldo Cruz, 217 · Empresarial Maurício de Nassau Trade Center, Maurício de Nassau", cidade: "Caruaru", uf: "PE", lat: -8.28067, lng: -35.97102, url: "https://www.selfitacademias.com.br/academias/pernambuco/caruaru/selfit-caruaru", emBreve: false },
  { nome: "Indianópolis", endereco: "Av. José Rodrigues de Jesus, 120, Indianópolis", cidade: "Caruaru", uf: "PE", lat: -8.28771, lng: -35.96331, url: "https://www.selfitacademias.com.br/academias/pernambuco/caruaru/indianopolis", emBreve: false },
  { nome: "Leão Dourado", endereco: "Av. Leão Dourado, 1664, Kennedy", cidade: "Caruaru", uf: "PE", lat: -8.28621, lng: -35.99656, url: "https://www.selfitacademias.com.br/academias/pernambuco/caruaru/leao-dourado", emBreve: false },
  { nome: "Life Center", endereco: "R. Cleto Campelo, 119, Nossa Sra. das Dores", cidade: "Caruaru", uf: "PE", lat: -8.2832, lng: -35.9689, url: "https://www.selfitacademias.com.br/academias/pernambuco/caruaru/life-center", emBreve: true },
];

export const rotaUrl = (u: Pick<Unidade, "lat" | "lng">) => `https://www.google.com/maps/dir/?api=1&destination=${u.lat},${u.lng}`;

/* ---------- Links ---------- */

export const LINKS = {
  saude: "https://saude.cppem.com.br/login",
  parceiros: "https://cppem.com.br/parceiros",
  dominioFinanceiro: "https://app-dominio-financeiro1.vercel.app/",
  ebook: "https://checkout.cppem.com.br/pay/ebook-de-educacao-financeira-01",
  lifeBoard: "https://app-life-board.vercel.app/",
};

export const EDUCACAO = [
  {
    tipo: "Supletivo",
    nome: "Supletivo CPPEM",
    texto: "Para quem ainda não concluiu o ensino fundamental ou o médio.",
    url: "https://supletivo.cppem.com.br",
    destaque: "",
  },
  {
    tipo: "Faculdade EAD",
    nome: "Unicive Caruaru",
    texto: "Graduação a distância reconhecida pelo MEC, com desconto exclusivo para alunos do CPPEM.",
    url: "https://unicive.cppem.com.br/",
    destaque: "Desconto para alunos",
  },
  {
    tipo: "Ensino fundamental e médio",
    nome: "Colégio CPPEM",
    texto: "Do fundamental ao médio, com bolsa exclusiva para filhos e familiares de alunos do CPPEM.",
    url: "https://colegio.cppem.com.br/",
    destaque: "Bolsa para a família",
  },
];
