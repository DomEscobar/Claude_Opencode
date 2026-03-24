# agents/skills/incident-response.md

## Trigger
Automated Sentry alert or user reports a production crash/regression.

## Steps
1. **Evidence Gathering:** Call `mcp_sentry_get_issue_details`.
2. **Context Sync:** Read `REGIONAL_MAP.md` and `backend/AGENTS.md` for the impacted domain.
3. **Reproduction:** Create a `tests/shadow/repro_test.go` that triggers the crash logic.
4. **Surgical Patch:** Apply an AST-node patch (Search/Replace).
5. **Reflection:** Run `go test` + `pnpm typecheck`.
6. **Closing:** Update `Durable Memory` Pitfalls if the error was architectural.

## Verification
- Reparation confirmed by Shadow Test exit code 0.
- PR title format: `fix(incident): [IncidentID] short description`
