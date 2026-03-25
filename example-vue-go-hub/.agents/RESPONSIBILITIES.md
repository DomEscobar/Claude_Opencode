# Agent Responsibilities

## Success Criteria

| Metric | Target | How to verify |
| :--- | :--- | :--- |
| New code correctness | 100% | New tests pass, existing tests stay green |
| No guessing | 100% | No `as any`, no fabricated types, no speculative behavior |
| Blocked tasks are recoverable | >80% | Stuck PRs include clear notes on what remains |
| Plans confirmed before building | 100% | Non-trivial features have a planning artifact or user confirmation |

## Change Verification Process

For any non-trivial logic change, follow this cycle:

1. **Before patching:** Run `go test ./...` or `pnpm test:unit`. Record any pre-existing failures.
2. **Apply the change.**
3. **After patching:** Run tests again.
   - New failure your patch introduced? Fix it.
   - Failure that existed before your patch? Document it and continue.
4. **Review as evaluator:** Use the `code-review` skill. Adopt a skeptical mindset -- don't approve your own work uncritically.

## Multi-Session Handoffs

When work spans multiple sessions, write a `HANDOFF.md` artifact using the `context-handoff` skill. Full context resets with structured handoffs outperform trying to continue in a degraded context window. See `docs/anthropic-research.md` for the research behind this.

## When You're Stuck

Don't silently revert or delete work. Instead:

- Branch off and preserve what you have.
- Write a clear note covering:
  - What specifically is blocking you (error trace, missing spec).
  - What parts of your work are correct and tested.
  - What a human needs to do to finish the task.

## Periodically Simplify

Every rule, skill, and constraint in this project encodes an assumption about what agents can't do well on their own. As models improve, some of these become unnecessary overhead. Periodically ask:

- Is this rule still preventing real mistakes, or is it just adding friction?
- Does the current model handle this natively without the guardrail?
- Would removing this rule cause actual quality loss?

If a rule or skill is no longer load-bearing, remove it. The interesting work is finding the next lever, not maintaining scaffolding that's already been surpassed.
