# Prompt Completo — Geração do MVP do Projeto Movie Picker

Você é um engenheiro de software sênior fullstack responsável pela construção completa do MVP da aplicação Movie Picker.

Seu objetivo é construir uma aplicação moderna, escalável, responsiva e monetizável para recomendação aleatória de filmes.

A aplicação será utilizada principalmente por casais e usuários indecisos que desejam descobrir rapidamente um filme para assistir.

A solução deverá seguir rigorosamente todas as definições técnicas, arquiteturais, visuais e regras de negócio descritas abaixo.

---

# Objetivo do MVP

Construir uma aplicação web funcional contendo:

* frontend React;
* backend NestJS;
* autenticação Google;
* persistência PostgreSQL;
* integração com TMDB;
* listagem de filmes;
* filtros;
* recomendação aleatória;
* persistência de filmes assistidos;
* avaliação de filmes;
* modal de recomendação;
* paginação;
* estrutura preparada para monetização com Google Ads.

---

# Stack Obrigatória

## Frontend

Utilizar obrigatoriamente:

* React
* TypeScript
* Vite
* TailwindCSS
* React Router
* TanStack Query
* React Hook Form
* Zod
* Axios
* shadcn/ui
* Lucide React

## Backend

Utilizar obrigatoriamente:

* Node.js
* NestJS
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT
* Passport
* Google OAuth

## Infraestrutura

Utilizar obrigatoriamente:

* Docker
* Docker Compose
* pnpm workspaces
* Monorepo
* GitHub

---

# Estrutura do Projeto

A estrutura deve ser exatamente:

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

---

# Estrutura Frontend

Criar estrutura:

```txt
src/
  app/
  pages/
  layouts/
  components/
  hooks/
  services/
  providers/
  modals/
  types/
  utils/
  constants/
```

---

# Estrutura Backend

Criar estrutura:

```txt
src/
  modules/
    auth/
    users/
    movies/
    movie-user/
    external-movies/

  common/
  prisma/
```

---

# Design da Aplicação

A interface deve:

* possuir visual moderno;
* utilizar tons escuros elegantes;
* possuir foco em UX;
* ser totalmente responsiva;
* possuir grid adaptável;
* funcionar bem em desktop e mobile;
* possuir aparência semelhante a plataformas modernas de streaming.

Sugestão visual:

* fundo: #111111
* cards: #1A1A1A
* destaque: #E50914
* texto principal: #FFFFFF
* texto secundário: #B3B3B3

---

# Estrutura da Página Principal

A página principal deve conter:

## Header

Com:

* logo do projeto;
* botão login Google;
* avatar do usuário autenticado.

---

## Área Central

Contendo:

### Filtros

Os filtros devem possuir:

#### Pesquisa

Input string.

#### Categoria

Select contendo:

* Ação
* Comédia
* Drama
* Documentários
* Esportes
* Fantasia
* Ficção científica
* Policial
* Romance
* Suspense
* Terror
* Anime

#### Visto

Select:

* Sim
* Não

#### Nota

Select:

* 1 estrela
* 2 estrelas
* 3 estrelas
* 4 estrelas
* 5 estrelas

A regra obrigatória:

* o filtro nota só pode ser habilitado caso:

  * Visto = Sim.

---

## Grid de Filmes

A listagem deve:

* possuir paginação;
* utilizar grid responsivo;
* exibir múltiplos filmes lado a lado;
* possuir duas fileiras em desktop;
* adaptar para mobile.

Cada card deve exibir:

* imagem do poster;
* título;
* categoria.

---

# Regras de Filme Assistido

Caso o filme esteja marcado como assistido:

Aplicar:

* overlay escuro;
* opacidade aproximada de 80%;
* cor #111111.

Exibir sobreposição contendo:

* ícone de olho;
* label “Assistido”;
* nota do usuário;
* ícone de estrela.

---

# Paginação

Abaixo da listagem deve existir:

* paginação completa;
* indicador de página atual;
* navegação próxima/anterior.

---

# Botão de Recomendação

Na direita da paginação deve existir:

```txt
Escolha para nós <3
```

Ao clicar:

* chamar endpoint backend;
* enviar filtros ativos;
* receber filme aleatório;
* abrir modal.

---

# Modal de Filme

O modal deve exibir:

* poster;
* título;
* descrição;
* duração;
* data lançamento;
* plataformas disponíveis;
* informação de dublagem;
* nota do usuário;
* select de nota.

Caso ainda não exista nota:

* exibir label:

```txt
Aguardando
```

Botões:

## Recomendar outro

* realizar novo sorteio;
* manter filtros atuais.

## Já assistimos

Só pode ser habilitado caso:

* usuário selecione nota.

---

# Regras do Botão “Já assistimos”

## Usuário autenticado

Ao clicar:

* persistir filme como assistido;
* persistir nota;
* gerar novo filme automaticamente.

## Usuário não autenticado

Ao clicar:

* redirecionar para login Google.

---

# Regras da Escolha Aleatória

O sorteio deve ocorrer exclusivamente no backend.

Fluxo:

1. receber filtros;
2. buscar filmes compatíveis;
3. remover filmes já vistos caso:

   * usuário esteja autenticado;
   * filtro visto não tenha sido definido;
4. escolher filme aleatório;
5. retornar filme completo.

Nunca realizar sorteio no frontend.

---

# Integração TMDB

Utilizar API da TMDB.

A integração deve:

* pesquisar filmes;
* obter poster;
* obter descrição;
* obter duração;
* obter categorias;
* obter data lançamento.

---

# Regra de Persistência Local

Ao pesquisar filme:

1. buscar localmente;
2. caso não exista:

   * buscar TMDB;
   * persistir localmente;
   * retornar resultado.

Evitar múltiplas chamadas desnecessárias.

---

# Banco de Dados

Utilizar PostgreSQL.

---

# Modelagem Obrigatória

## Users

Campos:

```txt
id
name
email
avatarUrl
googleId
createdAt
updatedAt
```

---

## Movies

Campos:

```txt
id
tmdbId
title
description
posterUrl
mainCategory
releaseDate
durationMinutes
isDubbedBr
createdAt
updatedAt
```

---

## MoviePlatforms

Campos:

```txt
id
movieId
platformName
platformUrl
type
```

---

## UserMovies

Campos:

```txt
id
userId
movieId
watched
rating
watchedAt
createdAt
updatedAt
```

---

# Regras Importantes

As informações:

* watched
* rating

Nunca pertencem ao filme globalmente.

Devem ser sempre vinculadas ao usuário.

---

# Autenticação

Implementar:

* Login Google;
* JWT;
* autenticação stateless.

Fluxo:

1. frontend autentica Google;
2. backend valida token;
3. backend cria/localiza usuário;
4. backend gera JWT;
5. frontend salva sessão.

---

# Endpoints Obrigatórios

## Movies

### GET /movies

Filtros:

```txt
search
category
watched
rating
page
limit
```

---

### POST /movies/random

Responsável pela recomendação.

---

### POST /movies/:id/watched

Responsável por marcar assistido.

Body:

```json
{
  "rating": 5
}
```

---

## Auth

### POST /auth/google

Responsável pelo login.

---

# Regras de Código

Sempre:

* utilizar TypeScript estrito;
* evitar any;
* criar componentes reutilizáveis;
* utilizar ESLint;
* utilizar Prettier;
* utilizar boas práticas SOLID;
* evitar componentes gigantes;
* evitar lógica de negócio em UI;
* utilizar hooks customizados;
* utilizar DTOs;
* validar inputs;
* tratar erros globalmente.

---

# Performance

Priorizar:

* lazy loading;
* cache;
* debounce;
* paginação;
* queries otimizadas;
* imagens otimizadas;
* índices no banco.

---

# Segurança

Implementar:

* CORS;
* validação inputs;
* sanitização;
* rate limit;
* variáveis ambiente;
* JWT seguro.

---

# Monetização

A aplicação deve possuir:

* área lateral esquerda;
* área lateral direita.

Essas áreas serão reservadas para:

* Google Ads;
* banners;
* monetização futura.

Implementar componentes preparados para ads mesmo que inicialmente vazios.

---

# Docker

Criar:

* docker-compose;
* containers frontend;
* backend;
* postgres.

---

# README

Gerar README completo contendo:

* setup;
* instalação;
* variáveis ambiente;
* execução local;
* execução docker;
* scripts disponíveis;
* arquitetura;
* stack.

---

# Objetivo Final

Gerar um MVP:

* moderno;
* limpo;
* escalável;
* organizado;
* monetizável;
* responsivo;
* pronto para evolução futura.

A aplicação deve estar pronta para:

* deploy;
* evolução de features;
* integração futura com streaming providers;
* recomendações inteligentes;
* analytics;
* monetização real.
