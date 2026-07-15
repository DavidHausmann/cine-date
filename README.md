# Movie Picker (CineDate) MVP

Monorepo fullstack para recomendacao aleatoria de filmes com filtros, historico de assistidos e nota por usuario.

## Stack

- Frontend: React, TypeScript, Vite, TailwindCSS, React Router, TanStack Query, React Hook Form, Zod, Axios, Lucide React
- Backend: NestJS, TypeScript, Prisma ORM, PostgreSQL, JWT, Passport, Google OAuth token validation
- Infra: pnpm workspaces, Docker, Docker Compose

## Estrutura

```txt
movie-picker/
  apps/
    web/
    api/
  packages/
    shared/
  docker/
  docker-compose.yml
  pnpm-workspace.yaml
  README.md
```

## Funcionalidades MVP

- Login com Google via endpoint `POST /auth/google`
- Listagem paginada de filmes (`GET /movies`) com filtros:
  - `search`
  - `category`
  - `watched`
  - `rating` (habilitado apenas quando `watched=true`)
  - `page`
  - `limit`
- Recomendacao aleatoria no backend (`POST /movies/random`)
- Marcar filme assistido com nota (`POST /movies/:id/watched`)
- Persistencia local+TMDB:
  - busca local primeiro
  - caso nao exista, consulta TMDB e persiste
- Overlay visual para filmes assistidos
- Modal de recomendacao com poster, descricao, duracao, plataformas, dublagem e nota
- Areas laterais reservadas para Ads

## Requisitos

- Node.js 22+
- pnpm 10+
- Docker + Docker Compose

## Configuracao

1. Instale dependencias:

```bash
pnpm install
```

2. Copie as variaveis de ambiente:

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

3. Ajuste no `.env`:

- `TMDB_API_KEY`
- `GOOGLE_CLIENT_ID`
- `JWT_SECRET`

## Rodando com Docker

```bash
docker compose up --build
```

Servicos:

- Web: http://localhost:5173
- API: http://localhost:3000
- PostgreSQL: localhost:5432

## Rodando local (sem Docker)

1. Suba apenas o Postgres:

```bash
docker compose up -d postgres
```

2. Gere cliente Prisma e rode migracao:

```bash
pnpm prisma:generate
pnpm prisma:migrate
```

3. Inicie frontend e backend:

```bash
pnpm dev
```

## Scripts da raiz

- `pnpm dev`
- `pnpm dev:web`
- `pnpm dev:api`
- `pnpm build`
- `pnpm lint`
- `pnpm format`
- `pnpm prisma:generate`
- `pnpm prisma:migrate`
- `pnpm prisma:studio`

## Arquitetura

- `apps/api` organiza dominio em modulos:
  - `auth`
  - `users`
  - `movies`
  - `movie-user`
  - `external-movies`
- `apps/web` separa layout, pagina, componentes, hooks e servicos
- `packages/shared` centraliza contratos de tipos compartilhados

## Seguranca e performance aplicadas

- Validacao global de DTOs com `ValidationPipe`
- CORS configuravel por ambiente
- Rate limit no backend via `@nestjs/throttler`
- JWT stateless
- Paginacao server-side
- Cache de queries no frontend via TanStack Query

## Observacoes

- O sorteio sempre acontece no backend.
- Estado `watched` e `rating` e por usuario (tabela `UserMovie`), nunca global do filme.
- O frontend usa uma interface de login que envia Google ID token para o backend (`/auth/google`).
