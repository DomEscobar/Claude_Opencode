# Agent Responsibilities

## Success Criteria

| Metric | Target | How to verify |
| :--- | :--- | :--- |
| New code correctness | 100% | New tests pass, existing tests stay green |
| No guessing | 100% | No `as any`, no fabricated types, no speculative behavior |
| Blocked tasks are recoverable | >80% | Stuck PRs include clear notes on what remains |

## Change Verification Process

For any non-trivial logic change, follow this cycle:

1. **Before patching:** Run `go test ./...` or `pnpm test:unit`. Record any pre-existing failures.
2. **Apply the change.**
3. **After patching:** Run tests again.
   - New failure your patch introduced? Fix it.
   - Failure that existed before your patch? Document it and continue.

## When You're Stuck

Don't silently revert or delete work. Instead:

- Branch off and preserve what you have.
- Write a clear note covering:
  - What specifically is blocking you (error trace, missing spec).
  - What parts of your work are correct and tested.
  - What a human needs to do to finish the task.
