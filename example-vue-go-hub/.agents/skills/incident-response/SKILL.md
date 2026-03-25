---
name: incident-response
description: Respond to production errors reported via Sentry alerts, user reports, or failing health checks. Gather evidence, reproduce with a test, apply a targeted fix, and verify. Use for production emergencies, not regular bugs.
---

# Skill: Incident Response

## Steps

1. **Gather evidence:** Read the error trace, logs, or Sentry issue details.
2. **Locate the code:** Use `REGIONAL_MAP.md` to find the affected module.
3. **Reproduce:** Write a test that triggers the failure (`_test.go` in the same package).
4. **Fix:** Apply a targeted patch. Keep the change as small as possible.
5. **Verify:** Run `go test ./...` and `pnpm typecheck` to confirm the fix and check for regressions.
6. **Document:** If the root cause was an architectural issue, note it for future reference.

## PR format
`fix(incident): [ID] short description of what was fixed`
