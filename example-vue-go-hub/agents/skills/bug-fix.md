# Skill: Bug Fix

## When to use
User reports a bug, a test is failing, or unexpected behavior is found during development.
For production incidents with Sentry alerts, use `incident-response.md` instead.

## Steps

1. **Understand the bug:** Read the error message, stack trace, or reproduction steps. If unclear, ask the user for more details before proceeding.

2. **Locate the code:** Use `REGIONAL_MAP.md` to find the affected module. Read the relevant source files.

3. **Write a failing test first:**
   - Create a test that reproduces the exact bug
   - Run it to confirm it fails for the right reason
   - This test becomes your proof that the fix works

4. **Fix the code:**
   - Make the smallest possible change that fixes the bug
   - Don't refactor surrounding code in the same change
   - Check for the same bug pattern in related code (if found, note it but fix separately)

5. **Verify:**
   - The failing test now passes
   - All existing tests still pass
   - Run lint/vet to check for new issues

6. **Commit:**
   - Format: `fix(scope): description of what was wrong`
   - Include in the commit message: what the bug was, what caused it, and how it was fixed

## Common pitfalls
- Don't fix the symptom without understanding the root cause
- Don't mix the fix with unrelated changes
- Don't skip the failing test -- it prevents regressions
- Don't assume the bug only exists in one place -- check for the same pattern elsewhere
