FROM node:22-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/shared/package.json ./packages/shared/package.json
RUN pnpm install --filter @movie-picker/api... --frozen-lockfile=false

FROM deps AS build
COPY . .
RUN pnpm --filter @movie-picker/api prisma:generate
RUN pnpm --filter @movie-picker/api build

FROM node:22-slim AS runner
WORKDIR /app
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN corepack enable
ENV NODE_ENV=production
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/shared/package.json ./packages/shared/package.json
RUN pnpm install --filter @movie-picker/api... --frozen-lockfile=false
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/package.json ./apps/api/package.json
COPY --from=build /app/apps/api/prisma ./apps/api/prisma
COPY --from=build /app/packages/shared ./packages/shared
RUN pnpm --filter @movie-picker/api prisma:generate
EXPOSE 3000
WORKDIR /app/apps/api
CMD ["sh", "-c", "pnpm exec prisma db push --accept-data-loss && node dist/src/main.js"]
