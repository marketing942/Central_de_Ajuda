# Implementações de SEO — Central de Ajuda CPPEM

Repositório: [`marketing942/Central_de_Ajuda`](https://github.com/marketing942/Central_de_Ajuda) · branch `seo/otimizacao-organica-20261023` (base `main`) · 23/10/2026
Relatório consolidado do ecossistema: [RELATORIO-GERAL-SEO-ECOSSISTEMA.md](RELATORIO-GERAL-SEO-ECOSSISTEMA.md)

Commits na branch `seo/otimizacao-organica-20261023`. Nada foi publicado; merge e deploy dependem de aprovação.

## Arquivos modificados

| Arquivo | Alteração | Por quê |
|---|---|---|
| lib/seo.ts (novo) | `SITE_URL`, `OG_IMAGE`, `openGraphFor()`, `websiteJsonLd()`, `breadcrumbJsonLd()`, `serializeJsonLd()` (escapa `<`, como recomenda o guia de JSON-LD do Next 16) | Um lugar só para as regras de SEO |
| components/json-ld.tsx (novo) | `<JsonLd data={...} />` |  |
| app/page.tsx | Metadata própria (title absoluto, description, canonical `/`, OG) + JSON-LD WebSite/Organization |  |
| app/[categoria]/page.tsx | Canonical `/{slug}`, OG, BreadcrumbList |  |
| app/artigo/[categoria]/[artigo]/page.tsx | OG tipo article, BreadcrumbList (canonical já existia) |  |
| app/confirma/page.tsx | OG próprio |  |
| app/layout.tsx | OG com siteName e imagem; `twitter:card` large |  |
| public/brand/og-central-de-ajuda.jpg (novo) | 1200×630 recortado de `bannerhero.png` |  |
| tests/seo.test.ts (novo) | Trilha, escape do JSON-LD e OG completo | 3 testes |

## Metadados — antes × depois

Extraídos do HTML renderizado localmente (Playwright/HTTP), antes e depois.

| Campo | Antes | Depois |
|---|---|---|
| `title` | Central de Ajuda CPPEM | Central de Ajuda CPPEM: suporte ao aluno e atendimento |
| `description` | Orientações oficiais do CPPEM: plataforma, turmas, mentoria, materiais e pagamentos. | Orientações oficiais do CPPEM sobre plataforma, turmas, mentoria, materiais e pagamentos, e os canais de atendimento ao aluno no WhatsApp. |
| `canonical` | — | https://central-de-ajuda.cppem.com.br |
| `og:title` | Central de Ajuda CPPEM | Central de Ajuda CPPEM: suporte ao aluno e atendimento |
| `og:description` | Como podemos te ajudar? | Orientações oficiais do CPPEM sobre plataforma, turmas, mentoria, materiais e pagamentos, e os canais de atendimento ao aluno no WhatsApp. |
| `og:image` | — | https://central-de-ajuda.cppem.com.br/brand/og-central-de-ajuda.jpg |
| `og:url` | — | https://central-de-ajuda.cppem.com.br |
| `og:site_name` | — | Central de Ajuda CPPEM |
| `twitter:card` | summary | summary_large_image |
| JSON-LD |  | Organization, WebSite |

### `/confirma`

| Campo | Antes | Depois |
|---|---|---|
| title | Confirmar número oficial \| Central de Ajuda CPPEM | Confirmar número oficial \| Central de Ajuda CPPEM |
| og:url | — | https://central-de-ajuda.cppem.com.br/confirma |
| og:image | — | https://central-de-ajuda.cppem.com.br/brand/og-central-de-ajuda.jpg |

Categorias e artigos não puderam ser renderizados aqui (sem token do Notion): o comportamento está coberto por `tests/seo.test.ts` e pela revisão do código.

## Dados estruturados

Só tipos aplicáveis e só com dados que a página mostra. Nada de avaliações,
preços inventados, prêmios ou credenciais. Sem `FAQPage` (o resultado de FAQ
foi restrito a sites de governo e saúde em 2023 — [Google — Mudanças nos resultados de FAQ/HowTo (2023)](https://developers.google.com/search/blog/2023/08/howto-faq-changes) — e o
changelog da documentação registra a descontinuação em 2026 — [Google — Atualizações da documentação da Pesquisa (changelog)](https://developers.google.com/search/updates)) e sem `Course`
(o Course Info saiu dos resultados em 2025: [Google — Simplificação da página de resultados (Course Info descontinuado, 2025)](https://developers.google.com/search/blog/2025/06/simplifying-search-results)). Sem promessa
de resultado enriquecido.

## Benefícios esperados

- Título e descrição alinhados à intenção principal → mais impressões
  relevantes e CTR (a confirmar no Search Console).
- Canonical absoluto → sinais concentrados no domínio de produção
  ([Google — Como especificar uma URL canônica](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)).
- `WebSite` com `name` no subdomínio → chance de o Google exibir o nome do site
  em vez do host ([Google — Nomes de sites na Pesquisa (subdomínios)](https://developers.google.com/search/docs/appearance/site-names)).
- Preview correto no WhatsApp/redes (tráfego de compartilhamento).
