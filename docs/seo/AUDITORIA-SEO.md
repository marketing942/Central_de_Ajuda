# Auditoria SEO — Central de Ajuda CPPEM

Repositório: [`marketing942/Central_de_Ajuda`](https://github.com/marketing942/Central_de_Ajuda) · branch `seo/otimizacao-organica-20261023` (base `main`) · 23/10/2026
Relatório consolidado do ecossistema: [RELATORIO-GERAL-SEO-ECOSSISTEMA.md](RELATORIO-GERAL-SEO-ECOSSISTEMA.md)

## Arquitetura

- **Domínio de produção:** central-de-ajuda.cppem.com.br (e confirma.cppem.com.br reescrito para /confirma) — evidência: README, `.env.example` (`NEXT_PUBLIC_SITE_URL`) e `next.config.ts`.
- **Stack:** Next.js 16.3 (App Router, Turbopack), React 19, TypeScript, Notion API como CMS, Vitest. Deploy por Dockerfile/compose (standalone) ou Vercel.
- **Renderização:** SSR em toda requisição (`dynamic = "force-dynamic"`), dados do Notion em cache de 5 min. Metadados no HTML inicial.

## Rotas

| Rota | O que é | Indexação |
|---|---|---|
| / | Busca + categorias + dúvidas em destaque | Indexar |
| /[categoria] | Artigos da categoria (slug do Notion) | Indexar |
| /artigo/[categoria]/[artigo] | Artigo (página inteira; clique interno abre popup interceptado) | Indexar |
| /confirma | Confirma se um número é oficial do CPPEM (antifraude) | Indexar |
| /api/consultar, /api/revalidate | APIs | Bloqueado no robots.ts |
| /robots.txt, /sitemap.xml | Gerados (sitemap dinâmico com categorias e artigos) | — |

## Finalidade e classificação

- **Objetivo:** Suporte ao aluno e proteção da marca (confirmação de números oficiais).
- **Unidade de negócio:** CPPEM (transversal)
- **Público:** Alunos e interessados com dúvidas; quem recebeu mensagem suspeita em nome do CPPEM.
- **Tipo de página:** Central de suporte.
- **Indexação recomendada:** Indexar. Buscas de marca + suporte ("CPPEM como acessar a plataforma", "número oficial CPPEM") devem cair aqui, não em páginas de terceiros.
- **Potencial orgânico:** **Médio (marca)** — Volume baixo, mas cada artigo responde uma dúvida real e reduz atendimento; `/confirma` protege contra golpes que usam o nome da marca.

## Problemas encontrados

Gravidade: **P0** crítico (indexação/integridade) · **P1** alto impacto · **P2** médio · **P3** evolução · **Info** registro sem ação de SEO.

| Sev. | Problema | Evidência | Impacto | Status |
|---|---|---|---|---|
| P1 | Home e categorias sem canonical | Só artigos e /confirma tinham `alternates.canonical` | Variações (`?q=`, host confirma.*) sem URL preferida | Corrigido |
| P2 | Sem imagem de compartilhamento e OG incompleto | `openGraph` do layout sem imagem; páginas sem OG próprio | Preview sem imagem; o merge raso do Next descartaria locale/siteName ao definir OG por página | Corrigido (helper `openGraphFor`) |
| P2 | Sem dados estruturados |  | Sem BreadcrumbList (trilha no resultado) e sem nome do site | Corrigido (WebSite/Organization + BreadcrumbList) |
| P2 | Title da home genérico | `Central de Ajuda CPPEM` | Pouca relevância para "suporte/atendimento CPPEM" | Corrigido |
| P2 | Falha do Notion vira 404 | `getHelpCenter()` devolve listas vazias em erro → categorias e artigos respondem 404 | Se o Googlebot passar durante uma falha, pode desindexar páginas boas | Recomendado (responder 503 quando a origem falhar) |
| P3 | Sem nenhuma ferramenta de mensuração | Nenhum GTM/GA4 no código | Não há como medir tráfego orgânico do suporte | Recomendado (decisão do time; fora do escopo de SEO) |
| P3 | Rodapé com vários H2 | `site-footer.tsx` | Hierarquia de headings poluída | Recomendado |

## Limitações desta auditoria

- **Produção inacessível desta sessão.** O proxy de rede do ambiente recusou
  conexões a `*.cppem.com.br` e `*.vercel.app`, e o leitor de páginas não
  resolveu esses domínios. Nada foi medido no site publicado: HTML servido,
  status HTTP, redirecionamentos e headers reais ficam **não validados**.
  Toda a auditoria foi feita no código e em servidores locais.
- **Sem Google Search Console, GA4, Keyword Planner, Trends, Semrush ou Ahrefs.**
  Não há volume, dificuldade, CPC nem posição. Nenhum número desse tipo
  aparece aqui. As prioridades de palavra-chave são **estimativas
  qualitativas** (intenção, tipo de página que aparece hoje, relevância
  comercial) e devem ser confirmadas no Search Console e no Planejador.
- **SERP observada com a busca web disponível, que não é o Google.** Os
  concorrentes listados são os que apareceram nessa busca e servem como
  indício, não como ranking do Google.
- **Lighthouse é dado de laboratório**, rodado localmente com os terceiros
  (GTM, PixelX, fontes do Google) bloqueados. Serve para comparar antes ×
  depois, não para prever o Core Web Vitals real (dado de campo do CrUX).
