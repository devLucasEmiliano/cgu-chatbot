# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi


# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# This will do the trick, use the corresponding env file for each environment.
COPY .env.production.sample .env.production
RUN npm run build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Instala AWS CLI
RUN apk add --no-cache aws-cli

# Gera certificado SSL para comunicação encriptada com Load Balancer
RUN apk add --no-cache openssl && \
    openssl req -new -newkey rsa:4096 -days 3650 -nodes -x509 \
    -subj "/C=BR/ST=DF/L=Brasilia/O=CGU/CN=*.cgu.gov.br" \
    -keyout /etc/ssl/private/server.key \
    -out /etc/ssl/certs/server.crt && \
    chown nextjs:nodejs /etc/ssl/private/server.key /etc/ssl/certs/server.crt && \
    chmod 600 /etc/ssl/private/server.key && \
    chmod 644 /etc/ssl/certs/server.crt

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/server-https.js ./
COPY --from=builder /app/scripts ./scripts
COPY --from=builder --chown=nextjs:nodejs /app/.env.production.secrets ./

# Torna os scripts executáveis e ajusta permissões
RUN chmod +x scripts/*.sh && \
    chown nextjs:nodejs .env.production.secrets

USER nextjs

EXPOSE 8083

ENV PORT=8083

ENTRYPOINT ["./scripts/entrypoint.sh"]

# CMD ["sh", "-c", "HOSTNAME=0.0.0.0 node server-https.js"]
CMD ["sh", "-c", "HOSTNAME=0.0.0.0 node server.js"]
