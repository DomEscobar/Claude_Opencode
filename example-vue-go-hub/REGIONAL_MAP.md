# Regional Map

Directory-to-feature lookup. Use this to navigate to the right code.

## Source Code

| Feature | Directory | Scoped rules |
| :--- | :--- | :--- |
| API server entry point | `backend/cmd/` | `backend/AGENTS.md` |
| Auth & login | `backend/internal/auth/` | `backend/AGENTS.md` |
| Domain types & contracts | `backend/internal/types/` | `backend/AGENTS.md` |
| Data access layer | `backend/internal/repository/` | `backend/AGENTS.md` |
| Database migrations | `backend/migrations/` | `backend/AGENTS.md` |
| UI components | `frontend/src/components/` | `frontend/AGENTS.md` |
| Component tests | `frontend/src/components/__tests__/` | `frontend/AGENTS.md` |
| Page views | `frontend/src/views/` | `frontend/AGENTS.md` |
| State management | `frontend/src/stores/` | `frontend/AGENTS.md` |

## Infrastructure & Tooling

| Feature | Directory | Notes |
| :--- | :--- | :--- |
| Validation scripts | `infrastructure/scripts/` | Backend and frontend structure checkers |
| CI/CD pipeline | `.github/workflows/` | GitHub Actions for test + lint + build |
| Agent skills | `agents/skills/` | Step-by-step recipes for common tasks |
| Agent responsibilities | `agents/RESPONSIBILITIES.md` | Success criteria and verification |
| MCP server reference | `agents/MCP_SERVERS.md` | Recommended MCP server configs |
| Architecture docs | `docs/` | Research report and design references |
