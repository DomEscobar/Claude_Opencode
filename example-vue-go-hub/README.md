# Vue + Go Hub

A monorepo template for Vue 3 + Go projects, structured for AI-assisted development.

## Structure

```
backend/          Go API server (Chi + GORM)
frontend/         Vue 3 SPA (Vite + Pinia + Tailwind)
.agents/          Agent skills, responsibilities, and MCP server reference
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
