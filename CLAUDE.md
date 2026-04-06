# Helpdesk — Contexto do Projeto

## Stack

| Camada     | Tecnologia                        |
|------------|-----------------------------------|
| Runtime    | Bun                               |
| Frontend   | React 19 + Vite + Tailwind CSS    |
| Backend    | Express 5 + TypeScript            |
| Base dados | PostgreSQL                        |
| AI         | Claude API (`@anthropic-ai/sdk`)  |
| Linguagem  | TypeScript (strict)               |

## Estrutura

Monorepo com Bun workspaces:

```
packages/
  server/   → Backend Express (porta 3001)
  client/   → Frontend React + Vite (porta 5173, proxy /api → server)
```

## Comandos

```bash
bun run dev           # server + client em paralelo
bun run dev:server    # só backend
bun run dev:client    # só frontend
bun run build         # build de produção
bun run typecheck     # verificação de tipos
```

## Convenções

- TypeScript strict em todo o código
- Interfaces e tipos em `types.ts`
- Rotas API prefixadas com `/api/`
- CSS via Tailwind — sem CSS custom exceto variáveis globais
- Mobile-first

## Context7 MCP — Documentação Atualizada

Usa o Context7 MCP para consultar documentação sempre que trabalhares com qualquer biblioteca ou framework deste projeto — mesmo que pareças saber a resposta. Os dados de treino podem estar desatualizados.

### Quando usar

- React, React Router, React DOM
- Express.js (rotas, middleware, API)
- Vite (config, plugins, proxy)
- Tailwind CSS (classes, config, plugins)
- Bun (runtime, package manager, bundler)
- PostgreSQL / pg (queries, pool, tipos)
- Anthropic SDK / Claude API

### Como usar

1. Começar sempre com `resolve-library-id` usando o nome da biblioteca e a pergunta
2. Escolher o melhor match pelo nome, reputação, e número de snippets
3. Chamar `query-docs` com o ID escolhido e a pergunta completa
4. Responder com base na documentação obtida

### Não usar Context7 para

- Refactoring de código existente
- Debug de lógica de negócio
- Code review
- Conceitos gerais de programação
