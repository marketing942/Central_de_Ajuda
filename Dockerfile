## Mesmo template do site-cppem (MV8 Tech), sem Supabase.
ARG NODE_VERSION=22.1.0

## ===== ETAPA 01: dependências =====
FROM node:${NODE_VERSION}-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

## ===== ETAPA 02: build =====
FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Nenhum segredo entra no build: Notion e canais de contato são lidos em
# runtime (todas as páginas são dinâmicas, com cache de 5 min nos dados).
RUN npm run build

## ===== ETAPA 03: execução =====
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder --chown=node:node /app/public ./public
RUN mkdir .next && chown node:node .next
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000
CMD ["node", "server.js"]
