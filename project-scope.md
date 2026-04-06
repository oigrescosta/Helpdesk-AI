## Problem

Helpdesk que permita ter um agente AI para responder aos emails, definir prioridades, classificar as tarefas.

## Solution

Sistema automatizado para dar feedback a qualquer momento dos tickets de forma a agilizar o tempo de resposta.

## Stack Técnica

| Camada    | Tecnologia          |
|-----------|---------------------|
| Frontend  | React + Tailwind    |
| Backend   | Express (Node.js)   |
| Base dados| PostgreSQL          |
| AI        | Claude API          |

## Fluxo do Ticket (MVP)

```
Email recebido
  → AI cria o ticket (extrai assunto, remetente, corpo)
  → AI classifica (prioridade + categoria)
  → AI gera resumo do ticket
  → Sistema notifica admin (email/dashboard)
  → Admin vê sugestão de resposta da AI
  → Admin aprova/edita e envia resposta
  → Ticket fechado
```

## Features — MVP (v1)

### Dashboard
- Lista de tickets com: assunto, data, remetente, prioridade, label, resumo AI
- Filtros por:
  - Categoria (definida pela AI na classificação)
  - Label/Estado: `Novo`, `Em Progresso`, `Em Espera`, `Fechado`
- Prioridades por cores e grau de urgência (Alta, Média, Baixa)

### Ingestão de Email
- Fonte de tickets: email (IMAP polling ou webhook via serviço como SendGrid/Mailgun)
- Parsing do email: extrair remetente, assunto, corpo, data

### AI (Claude API)
- **Classificação automática**: atribui prioridade e categoria ao ticket com base no conteúdo
- **Resumo**: gera resumo curto de cada ticket para visualização rápida no dashboard
- **Sugestão de resposta**: propõe resposta ao ticket para o admin aprovar/editar antes de enviar

### Autenticação
- Login apenas para admin (email/password)
- Sessões guardadas na base de dados (tabela `sessions` no PostgreSQL)
- Um único role na v1

### Notificações
- Notificação ao admin quando chega ticket novo (via dashboard e/ou email)

## Modelo de Dados (PostgreSQL)

### tickets
| Campo        | Tipo         | Notas                                      |
|--------------|--------------|--------------------------------------------|
| id           | UUID / SERIAL| PK                                         |
| subject      | VARCHAR      | Assunto do email                           |
| sender_email | VARCHAR      | Email do remetente                         |
| sender_name  | VARCHAR      | Nome do remetente (se disponível)          |
| body         | TEXT         | Corpo do email original                    |
| summary      | TEXT         | Resumo gerado pela AI                      |
| priority     | ENUM         | `high`, `medium`, `low`                    |
| category     | VARCHAR      | Categoria atribuída pela AI                |
| status       | ENUM         | `new`, `in_progress`, `on_hold`, `closed`  |
| created_at   | TIMESTAMP    |                                            |
| updated_at   | TIMESTAMP    |                                            |

### ticket_responses
| Campo        | Tipo         | Notas                                      |
|--------------|--------------|--------------------------------------------|
| id           | UUID / SERIAL| PK                                         |
| ticket_id    | FK           | Referência ao ticket                       |
| ai_suggestion| TEXT         | Resposta sugerida pela AI                  |
| final_response| TEXT        | Resposta aprovada/editada pelo admin       |
| responded_at | TIMESTAMP    |                                            |

### admins
| Campo        | Tipo         | Notas                                      |
|--------------|--------------|--------------------------------------------|
| id           | UUID / SERIAL| PK                                         |
| email        | VARCHAR      | Único                                      |
| password_hash| VARCHAR      | bcrypt                                     |
| created_at   | TIMESTAMP    |                                            |

### sessions
| Campo        | Tipo         | Notas                                      |
|--------------|--------------|--------------------------------------------|
| sid          | VARCHAR      | PK, session ID                             |
| sess         | JSON         | Dados da sessão (user id, etc.)            |
| expire       | TIMESTAMP    | Expiração da sessão                        |

## Questões em aberto para decidir

- [ ] **Ingestão de email**: IMAP polling (mais simples) ou webhook com SendGrid/Mailgun (mais fiável)?
- [ ] **Base de conhecimento**: a AI deve ter acesso a FAQs/docs para melhorar as respostas, ou responde apenas com base no conteúdo do ticket?
- [ ] **Envio de resposta**: o sistema envia o email de volta diretamente (SMTP) ou o admin responde manualmente fora do sistema?
- [ ] **Categorias**: pré-definidas ou a AI cria dinamicamente?
- [ ] **Hosting**: onde vai correr? (VPS, Vercel+Railway, Docker, etc.)
