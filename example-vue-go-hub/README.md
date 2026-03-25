# Vue + Go Hub

A monorepo template for Vue 3 + Go projects, structured for AI-assisted development.

## Architecture

```
                    ┌─────────────────────────────────────────────┐
                    │              Vue + Go Hub                   │
                    └────────────────────┬────────────────────────┘
                                         │
              ┌──────────────────────────┼──────────────────────────┐
              │                          │                          │
     ┌────────▼────────┐      ┌──────────▼──────────┐    ┌─────────▼─────────┐
     │    frontend/     │      │     backend/        │    │    .agents/        │
     │  Vue 3 + Vite    │      │   Go + Chi + GORM   │    │  Skills & Config  │
     │  Pinia + Tailwind│      │                     │    │                   │
     └────────┬─────────┘      └──────────┬──────────┘    └─────────┬─────────┘
              │                           │                         │
   ┌──────────┼──────────┐    ┌───────────┼──────────┐    ┌─────────┼─────────┐
   │ src/components/     │    │ cmd/main.go          │    │ skills/           │
   │ src/views/          │    │ internal/auth/       │    │   planning/       │
   │ src/stores/         │    │ internal/types/      │    │   code-review/    │
   │ src/router/         │    │ internal/repository/ │    │   sprint-contract/│
   └─────────────────────┘    │ migrations/          │    │   context-handoff/│
                              └──────────────────────┘    │   bug-fix/  ...   │
                                                          └───────────────────┘
```

## Request Flow

```
  Browser                    Frontend (Vite :5173)              Backend (Go :8080)
    │                              │                                  │
    │   GET /                      │                                  │
    ├─────────────────────────────►│                                  │
    │                              │                                  │
    │   HTML + Vue SPA             │                                  │
    │◄─────────────────────────────┤                                  │
    │                              │                                  │
    │   User action                │                                  │
    ├─────────────────────────────►│                                  │
    │                              │  POST /api/auth/login            │
    │                              │  (proxied by Vite)               │
    │                              ├─────────────────────────────────►│
    │                              │                                  │
    │                              │  { success: true, data: {...} }  │
    │                              │◄─────────────────────────────────┤
    │                              │                                  │
    │   UI updates via Pinia       │                                  │
    │◄─────────────────────────────┤                                  │
    │                              │                                  │
```

## Agent Workflow (Harness Pattern)

Based on [Anthropic's harness research](docs/anthropic-research.md):

```
  User Request
       │
       ▼
  ┌─────────┐     "Add user profiles"
  │ PLANNING │────► Expand into scoped spec with user stories
  └────┬──────┘     (confirm with user before proceeding)
       │
       ▼
  ┌──────────────┐  Define testable criteria:
  │   SPRINT     │  - "GET /api/users/:id returns 200"
  │  CONTRACT    │  - "ProfileView.vue renders name and email"
  └────┬─────────┘  - "3 tests cover happy path + errors"
       │
       ▼
  ┌──────────┐
  │ GENERATE │────► Write code following skills & AGENTS.md rules
  └────┬─────┘
       │
       ▼
  ┌──────────┐     Skeptical evaluator mindset:
  │ EVALUATE │────► Test running app, grade against criteria
  └────┬─────┘     (correctness & completeness weighted highest)
       │
       ├── FAIL ──► Fix issues, re-evaluate
       │
       ▼
  ┌──────────┐
  │   DONE   │────► Tests pass, criteria met, diff committed
  └──────────┘
```

## Skill Discovery

```
  Agent receives user request
       │
       ▼
  ┌────────────────────────┐
  │ Scan .agents/skills/   │  Read YAML frontmatter descriptions
  │ for matching skill     │  at startup (lightweight, no context cost)
  └────────┬───────────────┘
           │
     ┌─────┴─────┐
     │  Match?   │
     └─────┬─────┘
       YES │          NO
       ┌───▼───┐  ┌──────┐
       │ Load  │  │ Use  │
       │SKILL.md│  │rules │  Fall back to AGENTS.md
       │content│  │ only │  workflow rules
       └───┬───┘  └──┬───┘
           │         │
           └────┬────┘
                │
                ▼
         Execute task
```

## Backend Layer Structure

```
  HTTP Request
       │
       ▼
  ┌─────────────────┐
  │   Chi Router    │  cmd/main.go -- route registration
  │   + Middleware   │  (Logger, Recoverer)
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │    Handler      │  internal/auth/handler.go
  │                 │  Parse input, validate, call repository
  │                 │  NEVER contains business logic (rule BE-6)
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │  Repository     │  internal/repository/user.go
  │                 │  All DB queries live here (rule BE-2)
  │                 │  GORM queries, parameterized inputs
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │  APIResponse    │  internal/types/response.go
  │  Envelope       │  SuccessResponse(data) / ErrorResponse(msg)
  │                 │  All responses wrapped (rule BE-3)
  └─────────────────┘
```

## Frontend Component Flow

```
  ┌──────────────┐
  │  App.vue     │  <router-view />
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │  Router      │  src/router/index.ts
  │              │  Maps paths to views
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐         ┌──────────────┐
  │   Views      │────────►│   Stores     │  Pinia stores in src/stores/
  │  (pages)     │         │              │  API calls + state management
  └──────┬───────┘         └──────┬───────┘
         │                        │
         ▼                        ▼
  ┌──────────────┐         ┌──────────────┐
  │  Components  │         │  fetch()     │  Proxied to backend
  │  (reusable)  │         │  /api/...    │  via Vite config
  └──────────────┘         └──────────────┘
```

## Getting Started

### Backend

```bash
cd backend
go mod tidy
go run cmd/main.go
```

The API server starts on `http://localhost:8080`.

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

The dev server starts on `http://localhost:5173` and proxies `/api` requests to the backend.

### Environment

```bash
cp .env.example .env
# Edit .env with your actual values
```

## Make Commands

A `Makefile` provides a universal CLI interface. Run `make help` to see all targets.

| Task | Command |
| :--- | :--- |
| Start backend | `make dev-backend` |
| Start frontend | `make dev-frontend` |
| Start both | `make dev` |
| Run all tests | `make test` |
| Run backend tests | `make test-backend` |
| Run frontend tests | `make test-frontend` |
| Lint everything | `make lint` |
| Build frontend | `make build` |
| Validate structure | `make validate` |

## Agent Integration

This template includes `AGENTS.md` files and `.agents/` skills that provide context and rules for AI coding agents. These work with tools that support the Agent Skills standard (Claude Code, Cursor, Codex, Gemini CLI, GitHub Copilot, JetBrains, and others).

### Rules & Configuration

| File | Purpose |
| :--- | :--- |
| `AGENTS.md` | Project-wide rules, permissions, workflow, and git conventions |
| `backend/AGENTS.md` | Go backend conventions, commands, and examples |
| `frontend/AGENTS.md` | Vue frontend conventions, commands, and examples |
| `.agents/RESPONSIBILITIES.md` | Success criteria and verification process |
| `REGIONAL_MAP.md` | Directory-to-feature lookup |

### Skills (Auto-Discovered)

Skills follow the `.agents/skills/{name}/SKILL.md` standard. Agents auto-discover them via YAML frontmatter descriptions.

**Workflow skills** (based on [Anthropic's harness research](docs/anthropic-research.md)):

| Skill | Purpose |
| :--- | :--- |
| `planning` | Expand a brief request into a scoped spec before coding |
| `sprint-contract` | Define testable "done" criteria before implementing |
| `code-review` | Skeptical evaluator review with weighted grading criteria |
| `context-handoff` | Structured handoff artifact for multi-session work |

**Implementation skills:**

| Skill | Purpose |
| :--- | :--- |
| `new-vue-component` | Add a Vue component |
| `new-go-endpoint` | Add a Go API endpoint |
| `add-api-client-method` | Bridge backend endpoint to frontend |
| `database-migration` | Create safe database migrations |
| `refactoring` | Large-scale refactors without breaking things |
| `bug-fix` | Fix a bug with test-first approach |
| `incident-response` | Respond to production incidents |

### MCP Server Integration

See `.agents/MCP_SERVERS.md` for recommended MCP servers (Context7, Playwright, GitHub, Sentry, PostgreSQL) and their configuration.

### Research

See `docs/anthropic-research.md` for the research behind the workflow patterns (planner-generator-evaluator architecture, sprint contracts, context handoffs).

## CI/CD

GitHub Actions runs on every push and PR to `main`:
- **Backend:** `go vet`, `go test -race`, structure validation
- **Frontend:** typecheck, lint, test, build, structure validation
