# Skill: Incident Response

## When to use
A production error is reported (via Sentry alert, user report, or failing health check).

## Steps

1. **Gather evidence:** Read the error trace, logs, or Sentry issue details.
2. **Locate the code:** Use `REGIONAL_MAP.md` to find the affected module.
3. **Reproduce:** Write a test that triggers the failure (`_test.go` in the same package).
4. **Fix:** Apply a targeted patch. Keep the change as small as possible.
5. **Verify:** Run `go test ./...` and `pnpm typecheck` to confirm the fix and check for regressions.
6. **Document:** If the root cause was an architectural issue, note it for future reference.

## PR format
`fix(incident): [ID] short description of what was fixed`
