# Solicitações

Sistema de cadastro e acompanhamento de solicitações (consultas, exames, vacinação),
com fluxo de status controlado. React + TypeScript no frontend, Laravel (PHP) como API
REST, PostgreSQL como banco de dados.

## Stack

- **Frontend:** React, TypeScript, Vite, React Router, TanStack Query, React Hook Form + Zod
- **Backend:** Laravel (PHP), API REST versionada em `/api/v1`
- **Banco de dados:** PostgreSQL, esquema versionado por migrations do Laravel
- **Orquestração:** Docker Compose

## Como rodar

Pré-requisito: Docker com o plugin Compose.

```bash
cp .env.example .env
docker compose up -d
```

| Serviço | Endereço |
|---|---|
| Frontend | http://localhost:5173 |
| API | http://localhost:8000/api/v1 |
| PostgreSQL | `localhost:5432` |

Na primeira subida, o backend instala as dependências, gera a chave da aplicação e roda
as migrations automaticamente; o frontend instala as dependências do Node. Pode levar
alguns minutos.

```bash
docker compose ps               # confere se db, api e web estão rodando
docker compose logs -f api      # acompanha os logs (troque por web ou db)
docker compose down             # para tudo (o banco continua guardado no volume)
docker compose down -v          # para tudo e apaga também os dados
```

## Documentação da API

A especificação OpenAPI fica em [`docs/openapi.yaml`](docs/openapi.yaml) e cobre todos
os endpoints, parâmetros, filtros, corpos de requisição, respostas de sucesso, erros de
validação e códigos HTTP. Um resumo em prosa está em [`docs/API.md`](docs/API.md), e as
decisões do banco de dados em [`docs/banco-de-dados.md`](docs/banco-de-dados.md).

## Testes

### Backend (PHPUnit)

```bash
docker compose exec api php artisan test
```

O teste mais relevante fica em `backend/tests/Unit/StatusTransicaoTest.php`: verifica a
regra de negócio do fluxo de status (quais transições são permitidas a partir de cada
status, que não é possível pular ou voltar etapas, e que status finais não aceitam
nenhuma transição). É um teste de unidade puro, sobre o enum `Status` — não depende de
banco de dados nem de dados reais, e é determinístico.

Para rodar só esse teste:

```bash
docker compose exec api php artisan test --testsuite=Unit
```

### Frontend (Vitest + React Testing Library)

```bash
docker compose exec web npm run test
```

Dois arquivos cobrem regras de negócio relevantes, refletindo do lado do frontend as
mesmas regras verificadas no backend:

- `frontend/src/features/solicitacoes/schema.test.ts`: a validação do formulário de
  criação, incluindo a exigência de justificativa quando a prioridade é `URGENTE` (a
  mesma regra do `StoreSolicitacaoRequest` do backend) e os limites de caracteres.
- `frontend/src/features/solicitacoes/components/AlterarStatus.test.tsx`: o componente
  de troca de status só oferece os botões dos status permitidos pela API, um status
  final não mostra nenhuma ação, cancelar pede confirmação, e o sucesso ou erro da API é
  comunicado corretamente. Usa React Testing Library com a API simulada (`vi.mock`), sem
  chamadas de rede reais.

Ambos são determinísticos: não dependem de dados existentes no banco, de rede ou de
horário do sistema.

## Lint e formatação

**Backend** (Laravel Pint):

```bash
docker compose exec api ./vendor/bin/pint --test   # verifica sem alterar
docker compose exec api ./vendor/bin/pint          # corrige
```

**Frontend** (oxlint + Prettier):

```bash
docker compose exec web npm run lint            # linter
docker compose exec web npm run format:check    # verifica a formatação
docker compose exec web npm run format          # corrige a formatação
```

## Estrutura do repositório
.
├── docker-compose.yml
├── .env.example
├── README.md
├── docs/
│ ├── openapi.yaml especificação OpenAPI da API
│ ├── API.md documentação da API em prosa
│ └── banco-de-dados.md modelagem, constraints e índices
│
├── backend/ Laravel (API REST)
│ ├── Dockerfile
│ ├── docker/entrypoint.sh instala dependências, roda migrations, sobe o servidor
│ ├── app/
│ │ ├── Enums/ Categoria, Prioridade, Status (com o fluxo de transições)
│ │ ├── Exceptions/ TransicaoStatusInvalidaException (erro 422 da troca de status)
│ │ ├── Http/
│ │ │ ├── Controllers/Api/V1/SolicitacaoController.php
│ │ │ ├── Requests/ validação (FormRequests): criar, listar, alterar status
│ │ │ └── Resources/ SolicitacaoResource (formato do JSON de resposta)
│ │ ├── Models/Solicitacao.php
│ │ └── Services/ SolicitacaoService (troca de status, resumo)
│ ├── bootstrap/app.php rotas, erros da API sempre em JSON, sem detalhe interno
│ ├── database/migrations/ esquema da tabela solicitacoes e seus índices
│ ├── routes/api.php
│ └── tests/Unit/ StatusTransicaoTest (regra do fluxo de status)
│
└── frontend/ React + TypeScript (Vite)
├── vite.config.ts proxy /api -> api:8000
├── vitest.config.ts
└── src/
├── api/ cliente HTTP (axios) e erro padronizado (ApiError)
├── app/ layout, rotas e configuração do TanStack Query
├── shared/ componentes e hooks genéricos (estados, paginação,
│ campo de formulário)
├── features/solicitacoes/ tudo do domínio:
│ ├── types.ts contrato com a API
│ ├── api.ts chamadas HTTP da feature
│ ├── hooks.ts estados assíncronos (TanStack Query)
│ ├── schema.ts validação do formulário (Zod)
│ ├── filtros.ts filtros e paginação na URL
│ ├── components/ StatusBadge, FiltrosSolicitacaoForm, SolicitacaoForm,
│ │ AlterarStatus, tabela e cartões da listagem etc.
│ ├── pages/ DashboardPage, ListaSolicitacoesPage,
│ │ NovaSolicitacaoPage, DetalheSolicitacaoPage
│ └── *.test.ts(x) testes de comportamento (Vitest + Testing Library)
└── tests/setup.ts


## Uso de IA no desenvolvimento

Este projeto foi desenvolvido com apoio de IA (Claude, da Anthropic), usada para:

- Estruturar os arquivos e pastas do backend (Laravel) e do frontend (React), seguindo
  convenções de organização por domínio.
- Gerar comandos repetitivos de configuração (Docker, migrations, criação de arquivos),
  acelerando a montagem do ambiente.
- Estilizar as páginas do frontend em CSS, incluindo responsividade e o layout com
  tabela/cartões.
- Implementar os testes automatizados (PHPUnit no backend e Vitest/React Testing Library
  no frontend), área em que eu não tinha familiaridade prévia.

Todo o código gerado foi revisado, testado manualmente na aplicação rodando localmente e
ajustado ao longo do desenvolvimento antes de ser incorporado ao projeto.
