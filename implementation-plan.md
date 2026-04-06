# Plano de Implementação — Helpdesk AI

---

## Fase 1 — Setup & Fundação

Configuração do projeto, estrutura de pastas e base de dados.

### 1.1 Inicializar repositório e estrutura
- [ ] Criar repo Git com `.gitignore` (node_modules, .env, dist)
- [ ] Estrutura monorepo: `/client` (React) e `/server` (Express)
- [ ] Configurar ESLint + Prettier para ambos

### 1.2 Setup do Backend (Express)
- [ ] Inicializar projeto Node.js com TypeScript
- [ ] Configurar Express com middlewares base (cors, json parser, helmet)
- [ ] Configurar variáveis de ambiente (.env com dotenv)

### 1.3 Setup da Base de Dados (PostgreSQL)
- [ ] Configurar conexão PostgreSQL (pg ou Knex/Drizzle)
- [ ] Criar migrations para as tabelas: `admins`, `tickets`, `ticket_responses`, `sessions`

### 1.4 Setup do Frontend (React)
- [ ] Criar projeto React (Vite)
- [ ] Estrutura de pastas: `components/`, `pages/`, `hooks/`, `services/`, `lib/`

---

## Fase 2 — Autenticação

Login do admin com sessões em base de dados.

### 2.1 Backend — Auth
- [ ] Instalar `express-session` + `connect-pg-simple` + `bcrypt`
- [ ] Criar tabela de sessões no PostgreSQL
- [ ] Endpoint `POST /api/auth/login` (validar email/password, criar sessão)
- [ ] Endpoint `POST /api/auth/logout` (destruir sessão)
- [ ] Endpoint `GET /api/auth/me` (retornar admin autenticado)
- [ ] Middleware `requireAuth` para proteger rotas

### 2.2 Frontend — Auth
- [ ] Página de Login (formulário email/password)
- [ ] Context/hook `useAuth` para gerir estado de autenticação
- [ ] Redirecionar para login se não autenticado
- [ ] Layout base com sidebar/header para área autenticada

---

## Fase 3 — CRUD de Tickets

API e interface para gerir tickets (sem AI ainda).

### 3.1 Backend — API de Tickets
- [ ] `GET /api/tickets` — listar tickets com paginação
- [ ] `GET /api/tickets/:id` — detalhe de um ticket
- [ ] `PATCH /api/tickets/:id` — atualizar status, prioridade, categoria
- [ ] `GET /api/tickets?status=new&category=x` — filtros por query params

### 3.2 Frontend — Dashboard
- [ ] Página de listagem de tickets (tabela/cards)
- [ ] Colunas: assunto, remetente, data, prioridade (badge cor), label/status, resumo
- [ ] Filtros por: status (Novo, Em Progresso, Em Espera, Fechado) e categoria
- [ ] Cores de prioridade: Alta (vermelho), Média (amarelo), Baixa (verde)

### 3.3 Frontend — Detalhe do Ticket
- [ ] Página de detalhe com corpo completo do email
- [ ] Sidebar com metadata (prioridade, categoria, status, datas)
- [ ] Botões para mudar status
- [ ] Secção de resposta (textarea para o admin escrever/editar)

---

## Fase 4 — Integração com AI (Claude API)

Core do produto — classificação, resumo e sugestão de resposta.

### 4.1 Backend — Serviço AI
- [ ] Configurar cliente Claude API (`@anthropic-ai/sdk`)
- [ ] Criar módulo `ai/classify.ts` — recebe corpo do email, retorna `{ priority, category }`
- [ ] Criar módulo `ai/summarize.ts` — recebe corpo do email, retorna resumo curto
- [ ] Criar módulo `ai/suggest-reply.ts` — recebe ticket completo, retorna sugestão de resposta

### 4.2 Backend — Integrar AI no fluxo
- [ ] Ao criar ticket: chamar classify + summarize automaticamente
- [ ] Guardar resultados na tabela `tickets` (priority, category, summary)
- [ ] Endpoint `POST /api/tickets/:id/suggest-reply` — gerar sugestão de resposta on-demand
- [ ] Guardar sugestão em `ticket_responses.ai_suggestion`

### 4.3 Frontend — Mostrar AI
- [ ] Mostrar resumo AI na listagem de tickets
- [ ] No detalhe do ticket: mostrar classificação AI (prioridade + categoria)
- [ ] Botão "Gerar sugestão de resposta" no detalhe
- [ ] Mostrar sugestão AI no textarea para o admin editar antes de enviar

---

## Fase 5 — Ingestão de Email

Receber emails e criar tickets automaticamente.

### 5.1 Backend — Receber Emails
- [ ] Decidir abordagem: IMAP polling ou webhook (SendGrid/Mailgun)
- [ ] Implementar parsing de email (remetente, assunto, corpo, data)
- [ ] Limpar HTML do corpo do email (sanitizar)
- [ ] Criar ticket na DB automaticamente com dados extraídos

### 5.2 Backend — Pipeline Completo
- [ ] Email recebido → criar ticket → AI classifica + resume → guardar na DB
- [ ] Tratamento de erros (email mal formatado, falha na AI, duplicados)
- [ ] Logging do pipeline

---

## Fase 6 — Respostas e Notificações

Fechar o loop: responder ao ticket e notificar o admin.

### 6.1 Backend — Respostas
- [ ] Endpoint `POST /api/tickets/:id/respond` — guardar resposta final
- [ ] Enviar resposta por email ao remetente original (SMTP com Nodemailer)
- [ ] Atualizar status do ticket para `closed` após resposta

### 6.2 Notificações
- [ ] Notificação no dashboard quando chega ticket novo (polling ou WebSocket)
- [ ] Notificação por email ao admin (opcional, via Nodemailer)
- [ ] Badge/contador de tickets novos no header

---

## Fase 7 — Polish & Deploy

Refinamentos finais e colocar em produção.

### 7.1 UX & Polish
- [ ] Loading states e error handling em todas as páginas
- [ ] Empty states (sem tickets, sem resultados de filtro)
- [ ] Responsividade mobile
- [ ] Feedback visual nas ações (toast notifications)

### 7.2 Segurança
- [ ] Rate limiting nos endpoints de auth e AI
- [ ] Validação de inputs com Zod (backend)
- [ ] Sanitização de HTML dos emails (prevenir XSS)
- [ ] Helmet + CORS configurado para produção

### 7.3 Deploy
- [ ] Dockerizar backend + frontend
- [ ] Configurar PostgreSQL em produção
- [ ] Variáveis de ambiente de produção (Claude API key, SMTP, DB)
- [ ] CI/CD básico (build + deploy)
