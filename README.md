# Central de Ajuda CPPEM

`central-de-ajuda.cppem.com.br` — artigos de ajuda mantidos no Notion
(database **💬 Central de Ajuda — CPPEM**), na identidade visual do site novo.

## Como funciona

| URL | O que mostra |
|---|---|
| `/` | Busca + um card por opção do select **Categoria** + dúvidas em destaque |
| `/[categoria]` | Artigos publicados da categoria |
| `/confirma` | **Confirma número**: consulta se um telefone/WhatsApp é oficial do CPPEM (antigo site "Número Seguro") |
| `/artigo/[categoria]/[artigo]` | Clique dentro do site → **popup** sobre a página; link direto/F5 → página inteira |

- Só aparecem artigos com **Status = Publicado** e com **Categoria** preenchida.
- Categoria nova no Notion vira card automaticamente. Ícone e descrição ficam em
  [lib/categories.ts](lib/categories.ts) (categoria sem entrada usa um ícone padrão).
- Ordem: **Destaque** primeiro, depois a coluna opcional **Ordem**, depois alfabética.
- Colunas opcionais que o site já lê se forem criadas no Notion:
  **Resumo** (texto do card), **Ordem** (número), **Slug** (texto — fixa a URL
  mesmo se o título mudar).
- Conteúdo em cache por 5 min. Para publicar na hora:
  `POST /api/revalidate` com header `x-revalidate-secret: $REVALIDATE_SECRET`.

## Atendimento (WhatsApp)

"Ainda precisa de ajuda?" (no fim das páginas e do popup) mostra dois canais,
definidos em [lib/contact.ts](lib/contact.ts):

- **Assistente virtual (IA), 24h** → `links.cppem.com.br/suporte-cppem-ass`
- **Suporte ao aluno, seg. a sex. das 12h às 22h, exceto feriados** →
  `links.cppem.com.br/cppem-suporte-aluno` (mostra "Disponível agora" /
  "Volta segunda às 12h" pelo horário de Brasília; feriados em [lib/hours.ts](lib/hours.ts))

O número de destino é trocado no links.cppem.com.br, sem deploy aqui.

## Confirma número (`/confirma`)

Página antifraude: a pessoa digita um telefone e descobre se ele pertence a um canal oficial do CPPEM.
Antes era um site separado (repositório `ConfirmaNumero`, em `confirma.cppem.com.br`); agora é parte da Central
e usa o mesmo cabeçalho e rodapé. O aviso "Não leve golpes!" (em "Ainda precisa de ajuda?") e o rodapé levam para ela.

- Tela: [app/confirma/page.tsx](app/confirma/page.tsx) + [components/phone-checker.tsx](components/phone-checker.tsx)
- API: `POST /api/consultar` ([app/api/consultar/route.ts](app/api/consultar/route.ts)) — o número consultado não é gravado;
  limite de 15 consultas por minuto por IP
- Base oficial: database do Notion **"Números Oficiais CPPEM"** (colunas `Nome`, `Número E.164`, `Ativo`, `Data de ativação`,
  `Observações`). Só linhas com `Ativo` marcado são confirmadas. Para trocar um chip: desmarque `Ativo` no antigo (não apague)
  e crie uma linha nova com `55 + DDD + número`.
- Código da consulta: [lib/phone-registry.ts](lib/phone-registry.ts). Variáveis (ver `.env.example`):
  `NOTION_PHONE_TOKEN` (opcional; sem ele vale o `NOTION_TOKEN`), `NOTION_PHONE_DATABASE_ID`, `PHONE_REGISTRY_SOURCE`
  (`notion` por padrão; `supabase` e `auto` continuam disponíveis).
- ⚠️ A integração do Notion usada precisa estar **conectada à database de números** (••• → Conexões). Se o Notion falhar,
  nenhum número é confirmado (a lista inicial de 3 números só vale quando o Notion não está configurado).
- `confirma.cppem.com.br`: se esse domínio for apontado para esta aplicação, a raiz dele mostra a página `/confirma`
  (regra em [next.config.ts](next.config.ts)).

## Mira no lugar do cursor

No computador (mouse), o cursor vira uma mira de arma ([components/crosshair.tsx](components/crosshair.tsx) e o bloco
"Mira de arma" do `app/globals.css`). Em celular e tablet não muda nada.

## Vídeos e embeds

No Notion, use `/video` ou `/embed` com o link. Vira player dentro do popup:
YouTube, Vimeo, Loom, Panda Video, Google Drive, Google Docs/Slides/Forms e
Canva. Outros domínios aparecem como botão "Abrir link" (não viram iframe).

Prefira **YouTube "Não listado"**: arquivo enviado direto ao Notion funciona,
mas a URL que a API devolve expira em 1 hora.

## Rodar

```bash
cp .env.example .env.local   # preencher NOTION_TOKEN
npm install
npm run dev
npm test
```

A integração do `NOTION_TOKEN` precisa estar conectada à página
**CENTRAL DE AJUDA** no Notion (••• → Conexões). Sem isso a central aparece
vazia e o log mostra `object_not_found`.

Deploy: `Dockerfile` + `compose.yml` (mesmo padrão do site-cppem, Next standalone).
