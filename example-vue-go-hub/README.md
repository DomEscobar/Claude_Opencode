# Vue + Go Hub

A monorepo template for Vue 3 + Go projects, structured for AI-assisted development.

## Structure

```
backend/          Go API server (Chi + GORM)
frontend/         Vue 3 SPA (Vite + Pinia + Tailwind)
agents/           Agent skills, responsibilities, and MCP server reference
infrastructure/   Scripts and validation tools
docs/             Architecture references
.github/          CI/CD workflows
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

This template includes `AGENTS.md` files that provide context and rules for AI coding agents.
These work with tools like Claude Code, Codex, Cursor, and other agent-based development tools.

### Rules & Configuration

| File | Purpose |
| :--- | :--- |
| `AGENTS.md` | Project-wide rules, permissions, workflow, and git conventions |
| `backend/AGENTS.md` | Go backend conventions, commands, and examples |
| `frontend/AGENTS.md` | Vue frontend conventions, commands, and examples |
| `agents/RESPONSIBILITIES.md` | Success criteria and verification process |
| `REGIONAL_MAP.md` | Directory-to-feature lookup |

### Skills (Step-by-Step Recipes)

| Skill | Purpose |
| :--- | :--- |
| `agents/skills/new-vue-component.md` | Add a Vue component |
| `agents/skills/new-go-endpoint.md` | Add a Go API endpoint |
| `agents/skills/add-api-client-method.md` | Bridge backend endpoint to frontend |
| `agents/skills/database-migration.md` | Create safe database migrations |
| `agents/skills/refactoring.md` | Large-scale refactors without breaking things |
| `agents/skills/code-review.md` | Self-review checklist before submitting |
| `agents/skills/bug-fix.md` | Fix a bug with test-first approach |
| `agents/skills/incident-response.md` | Respond to production incidents |

### MCP Server Integration

See `agents/MCP_SERVERS.md` for recommended MCP servers (Context7, Playwright, GitHub, Sentry, PostgreSQL) and their configuration.

## CI/CD

GitHub Actions runs on every push and PR to `main`:
- **Backend:** `go vet`, `go test -race`, structure validation
- **Frontend:** typecheck, lint, test, build, structure validation
