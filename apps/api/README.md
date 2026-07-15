# API - Movie Picker

Backend NestJS responsavel por autenticacao, filmes e recomendacao aleatoria.

## Modulos

- `auth`
- `users`
- `movies`
- `movie-user`
- `external-movies`

## Endpoints principais

- `POST /auth/google`
- `GET /movies`
- `POST /movies/random`
- `POST /movies/:id/watched`

## Comandos

```bash
pnpm dev
pnpm prisma:generate
pnpm prisma:migrate
```
