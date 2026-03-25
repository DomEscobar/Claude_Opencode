---
name: sprint-contract
description: Define testable completion criteria before implementing a feature. Use when starting a non-trivial implementation to agree on what "done" looks like in concrete, verifiable terms before writing code.
---

# Skill: Sprint Contract

Based on [Anthropic's harness research](../../docs/anthropic-research.md): defining testable "done" criteria before building prevents drift and catches gaps that vague specs miss.

## When to use
- After the planning skill has produced a spec (or the user has given clear requirements)
- Before starting implementation of a feature that has multiple acceptance criteria
- When the scope is large enough that "it works" isn't a sufficient definition of done

## Steps

1. **Read the spec or user requirements.** Understand what the feature should do from the user's perspective.

2. **Write a sprint contract** with concrete, testable criteria. Each criterion should be:
   - **Specific:** "User can submit the form and see a success message" not "form works"
   - **Testable:** You can verify it by running a command, clicking through the UI, or checking a response
   - **Independent:** Each criterion can be checked separately

3. **Include edge cases.** Think about what happens with:
   - Empty or invalid input
   - Missing data
   - Network errors
   - Concurrent operations
   - Boundary values

4. **Present the contract.** Confirm with the user that these criteria cover what they expect.

5. **Build against the contract.** During implementation, check criteria off as you satisfy them.

6. **Verify every criterion.** After implementation, go through each criterion and confirm it passes. Report any that failed and why.

## Example contract

```markdown
## Sprint Contract: Login Feature

### Criteria
1. POST /api/auth/login accepts email and password in JSON body
2. Valid credentials return 200 with APIResponse containing user data
3. Invalid credentials return 401 with APIResponse containing error message
4. Missing email or password returns 400 with specific validation message
5. Empty string email or password returns 400 (not treated as valid)
6. Response never includes the password field in any case
7. Login handler is registered in cmd/main.go under /api/auth/login
8. At least 3 tests exist covering cases 2, 3, and 4
9. go vet ./... passes with no issues
10. Frontend auth store calls the endpoint and updates state on success

### Verification method
- Criteria 1-6: go test -v ./internal/auth/
- Criterion 7: read cmd/main.go, confirm route exists
- Criterion 8: count test functions in handler_test.go
- Criterion 9: run go vet ./...
- Criterion 10: pnpm typecheck passes, store method exists
```

## Anti-patterns
- Don't write criteria so vague they always pass ("it should work correctly")
- Don't write criteria that require manual visual inspection without specifying what to look for
- Don't skip the contract for "simple" features -- even small features benefit from 3-5 criteria
