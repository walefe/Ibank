# -------------------------------------------------
# Base stage: install dependencies
# -------------------------------------------------
FROM node:lts AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
COPY prisma.config.ts ./
COPY src/module/shared/database/prisma ./src/module/shared/database/prisma

RUN pnpm install --frozen-lockfile
RUN pnpm exec prisma generate
# -------------------------------------------------
# Development stage
# -------------------------------------------------
FROM base AS development
COPY . .
EXPOSE 3000 5555
CMD ["sh", "-c", "pnpm exec prisma db push && pnpm run start:dev"]
# -------------------------------------------------
# Build stage
# -------------------------------------------------
FROM base AS build
COPY . .
RUN pnpm run build
RUN pnpm prune --prod
# -------------------------------------------------
# Production stage
# -------------------------------------------------
FROM node:lts AS production
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
COPY prisma.config.ts ./
COPY src/module/shared/database/prisma ./src/module/shared/database/prisma

RUN pnpm install --frozen-lockfile --prod
RUN pnpm exec prisma generate

COPY --from=build app/dist ./dist

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app

EXPOSE 3000

CMD ["sh", "-c", "pnpm exec prisma migrate deploy && node dist/main"]
