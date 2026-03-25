# AGENTS.md

## Project
Vue 3 + Go monorepo. Frontend in `frontend/`, backend in `backend/`.

## Directory Guide
See `REGIONAL_MAP.md` to find which directory owns which feature.
Scoped rules live in `backend/AGENTS.md` and `frontend/AGENTS.md`.

## Permissions

Allowed without asking:
- Read any file, list directories, search code
- Run single-file lint, typecheck, or test commands
- Run `go vet`, `pnpm typecheck`, `make lint`
- Create or modify test files
- Create new files in existing directories

Ask first:
- Install new packages (`go get`, `pnpm add`)
- Delete files
- Modify `go.mod`, `package.json`, `docker-compose.yml`, or `.env`
- Run full build or end-to-end test suites
- Push to remote or create pull requests
- Add new top-level directories

Never:
- Modify `.env` files containing real secrets
- Run database migrations against non-local environments
- Force push or rebase shared branches
- Commit files matching `.env`, `*.pem`, `*.key`, `*credentials*`
- Use `rm -rf` on any directory

## Workflow Rules

1. **Check for a matching skill before starting.** Skills in `.agents/skills/` contain step-by-step recipes for common tasks. If one matches your task, read its `SKILL.md` and follow it.

2. **Plan before building.** For non-trivial features (3+ files, multi-layer, open-ended), use the `planning` skill to expand the requirement into a scoped spec and confirm with the user before writing code.

3. **Define done before implementing.** For features with multiple acceptance criteria, use the `sprint-contract` skill to negotiate testable completion criteria before starting.

4. **Run tests before and after every change.** Record which tests fail before your patch. If a test that was already failing still fails after your patch, note it and move on. If your patch introduces a new failure, fix it before proceeding.

5. **Don't guess at missing context.** If you need to know what a type looks like or how a function behaves, read the file. Never fabricate interfaces, types, or behavior you haven't verified.

6. **Review as an evaluator, not as the author.** When reviewing your own work, adopt a skeptical mindset. Test the running application when possible. Use the `code-review` skill with its weighted grading criteria.

7. **Verify before reporting success.** Every completed task must include evidence: a passing test run, a successful build, or a lint check. No "it should work" conclusions.

8. **Use structured handoffs for multi-session work.** When work spans sessions or context is getting large, use the `context-handoff` skill to write a handoff artifact instead of relying on conversation history.

## High-Scrutiny Files
Run `git log --oneline -10` before editing any of these:
- Config files: `.env`, `docker-compose.yml`, `go.mod`, `package.json`
- Migration files: `backend/migrations/*.sql`
- Files imported by 5+ other files
- Auth or security modules

## Git Conventions
- Commit format: `type(scope): short description`
  - Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`
  - Scope: `auth`, `dashboard`, `billing`, `infra`, etc.
- Branch naming: `type/short-description` (e.g. `feat/user-pagination`)
- Keep PRs under 400 lines of diff when possible
- PR title matches the primary commit format

## Examples to Follow
- Handler pattern: see `backend/internal/auth/handler.go`
- Response envelope: see `backend/internal/types/response.go`
- Vue component with typed props: see `frontend/src/components/UserCard.vue`
- Pinia store: see `frontend/src/stores/auth.ts`

## Anti-Patterns (never do this)
- Don't use `interface{}` / `any` in Go when the type is known
- Don't create `<style>` blocks in Vue -- use Tailwind classes
- Don't put business logic in handlers -- delegate to repositories
- Don't use `as any` in TypeScript
- Don't add heavy dependencies without approval

## Skills
Auto-discovered from `.agents/skills/`. Each skill folder contains a `SKILL.md` with a description that agents match against your request. Available skills:

**Workflow skills (harness patterns):**
- **planning** -- Expand a brief request into a scoped spec before coding
- **sprint-contract** -- Define testable "done" criteria before implementing
- **code-review** -- Skeptical evaluator review with weighted grading criteria
- **context-handoff** -- Structured handoff artifact for multi-session work

**Implementation skills:**
- **new-vue-component** -- Add a Vue component with typed props and test
- **new-go-endpoint** -- Add a Go API endpoint with handler and test
- **add-api-client-method** -- Bridge a backend endpoint to the frontend
- **database-migration** -- Create safe, reversible database migrations
- **refactoring** -- Large-scale refactors without breaking things
- **bug-fix** -- Fix a bug with test-first approach
- **incident-response** -- Respond to production incidents

## MCP Servers
See `.agents/MCP_SERVERS.md` for recommended MCP server integrations and setup.

## Research
See `docs/anthropic-research.md` for the research behind the workflow patterns above.

## When In Doubt, Ask
If a task is ambiguous, ask before coding. Example: "Add pagination" -- ask whether the user wants offset-based or cursor-based pagination before writing code.
