# cine-date

Projeto iniciado como **monorepo** para manter frontend e backend sincronizados no mesmo repositório.

## Estrutura recomendada

```txt
movie-picker/
  apps/
    web/        # React + Vite
    api/        # NestJS
  packages/
    shared/     # tipos, schemas e constantes compartilhadas
  docker/
  .env.example
  docker-compose.yml
  README.md
```

## Organização

- `apps/web`: frontend React + Vite
- `apps/api`: backend NestJS + Prisma
- `packages/shared`: tipos compartilhados entre frontend e backend

### Tipos compartilhados atuais

- `Movie`
- `User`
- `MovieCategory`
- `MovieFilters`

## Workspaces

Este repositório usa **pnpm workspaces**:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

## Stack inicial recomendada

- React + Vite em `apps/web`
- NestJS em `apps/api`
- Tipos compartilhados em `packages/shared`
- PostgreSQL via Docker (`docker-compose.yml`)
- Prisma no backend
