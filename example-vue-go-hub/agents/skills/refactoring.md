# Skill: Refactoring

## When to use
User asks to restructure, rename, move, or reorganize code without changing behavior.

## Core principle
A refactor must not change behavior. Tests must pass identically before and after.

## Before you start
- Run the full test suite and record the results. This is your baseline.
- Read `REGIONAL_MAP.md` to understand which modules will be affected.
- If the refactor touches 5+ files, outline the plan and confirm with the user before starting.

## Rules
- Move or rename one file at a time. Verify tests pass after each move.
- Update all imports/references before deleting the old path.
- Never refactor and add features in the same change. Separate commits.
- Never refactor and fix bugs in the same change. Separate commits.
- If a function is used by 5+ files, check with the user before renaming it.

## Steps

1. **Baseline:** Run `make test` (or `go test ./...` + `pnpm test:unit`). Record output.
2. **Plan:** List every file that will change. Confirm scope with user if large.
3. **Execute incrementally:**
   - Move/rename one file or symbol at a time
   - Update all references (imports, usages, tests)
   - Run tests after each individual change
   - Commit after each verified step
4. **Final check:** Run the full test suite. Compare against baseline.
   - Same pass/fail results = success
   - New failures = your refactor broke something, fix it
5. **Clean up:** Remove any leftover dead code, unused imports, or empty directories.

## Verify
- Test results after refactoring match the baseline exactly.
- No unused imports or dead code remain.
- `go vet ./...` and `pnpm lint` pass.
- Commit message format: `refactor(scope): description`
