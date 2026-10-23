# Relatório de testes — Central de Ajuda CPPEM

Repositório: [`marketing942/Central_de_Ajuda`](https://github.com/marketing942/Central_de_Ajuda) · branch `seo/otimizacao-organica-20261023` (base `main`) · 23/10/2026
Relatório consolidado do ecossistema: [RELATORIO-GERAL-SEO-ECOSSISTEMA.md](RELATORIO-GERAL-SEO-ECOSSISTEMA.md)

## Testes técnicos

- `npm ci` OK · `npm run lint` (ESLint 9) OK · `npm test` (Vitest) **35/35** (3 novos em `tests/seo.test.ts`) · `npm run build` (Next 16, Turbopack) OK · `npx tsc --noEmit` OK após o build gerar os tipos globais (`PageProps`).
- Servidor de produção local (`next start`) com `NEXT_PUBLIC_SITE_URL`: `/` 200, `/confirma` 200, `/robots.txt` 200, `/sitemap.xml` 200, rota inexistente 404 — mesmos status do original.
- Sem `NOTION_TOKEN` neste ambiente: a home renderiza o estado vazio; categorias/artigos cobertos pelos testes unitários.

## Testes funcionais e de tracking

Original (worktree da `main`) e modificado servidos localmente lado a
lado; Chromium (Playwright) com **toda a rede externa interceptada**: o que a
página tenta chamar é registrado e abortado, então nenhum lead fictício chegou
à planilha, à PixelX ou ao WhatsApp.

—

## Lighthouse (laboratório, mobile simulado, terceiros bloqueados)

| | Resultado |
|---|---|
| Antes | — |
| Depois | perf 83 · SEO 100 · acess. 90 · BP 100 · LCP 3,5 s · TBT 360 ms (sem token do Notion: central vazia) |

Sem baseline comparável: o build original foi validado só pelo HTML (mesmas rotas, mesmos status).

## O que não foi validado

- Disparo do **Lead na PixelX** e o recebimento no GTM server-side/Meta: o
  container e a PixelX vêm de `sgtm.cppem.com.br`/`pxa.cppem.com.br`, bloqueados
  neste ambiente. **Não validado por falta de acesso.** O código que a PixelX lê
  (id do form, `name` dos campos, evento `submit`) está idêntico.
- HTML, headers e redirecionamentos **em produção** (domínios bloqueados).
- Rich Results Test e Schema Markup Validator (sem acesso aos sites do Google);
  o JSON-LD foi validado por parse e por conferência manual dos campos
  obrigatórios.
