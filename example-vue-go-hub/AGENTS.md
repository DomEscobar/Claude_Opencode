# AGENTS.md

## Identity & Context
Universal Agentic Hub - Example Vue + Go Monorepo.
This is a production-ready template demonstrating the 2026 "Nervous System" architecture.
**Stack:** Go (Backend) + Vue 3 (Frontend) + PostgreSQL.

## Hard Rules
- [HR-1] NEVER use `as any` in TypeScript or `interface{}` in Go without strict justification.
- [HR-2] All database schema changes MUST happen via migrations in `backend/migrations`.
- [HR-3] NEVER commit secrets or .env files. Use the mock config for tests.
- [HR-4] All public API endpoints MUST have a corresponding test in `backend/tests`.

## Commands
```bash
# Global Verification
pnpm typecheck        # Run TS checks across project
go test ./...         # Run all Go tests
```

## Available Skills
Read the corresponding skill file BEFORE starting the task:
- New API endpoint -> read agents/skills/new-go-endpoint.md
- New Vue component -> read agents/skills/new-vue-component.md

## Pitfalls
- **Go context:** Always propagate `ctx` to database queries.
- **Vue reactivity:** Use `ref` for primitives and `reactive` for objects to ensure consistent logic.
- **CORS:** Frontend runs on :5173, Backend on :8080. Check `main.go` for allowed origins.
