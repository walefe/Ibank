# -------------------------------------------------
# Base stage: install dependencies
# -------------------------------------------------
FROM node:lts AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
COPY prisma.config.ts ./
COPY src/shared/database/prisma ./src/shared/database/prisma

RUN pnpm install --frozen-lockfile
RUN pnpm exec prisma generate
# -------------------------------------------------
# Development stage
# -------------------------------------------------
FROM base AS development
COPY . .
EXPOSE 3000
# -------------------------------------------------
# Build stage
# -------------------------------------------------
FROM base AS build
COPY . .
RUN pnpm run build
# -------------------------------------------------
# Production stage
# -------------------------------------------------
FROM node:lts AS production
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
COPY prisma.config.ts ./
COPY src/shared/database/prisma ./src/shared/database/prisma

RUN pnpm install --frozen-lockfile
RUN pnpm exec prisma generate
RUN pnpm install --frozen-lockfile --prod

COPY --from=build /usr/src/app/dist ./dist
EXPOSE 3000

CMD ["node", "dist/main"]
