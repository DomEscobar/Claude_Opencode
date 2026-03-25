---
name: code-review
description: Review code as a skeptical evaluator, not as the author. Test the running application, grade against weighted criteria, and provide actionable feedback. Use before submitting any change, when asked to review a diff or PR, or after another agent's work.
---

# Skill: Code Review

Based on [Anthropic's harness research](../../docs/anthropic-research.md): agents that review their own work are consistently too lenient. Act as a **separate evaluator** -- skeptical by default, testing the running application, grading against concrete criteria.

## Evaluator mindset
- You are not the author of this code. Approach it as a skeptical reviewer.
- Don't talk yourself out of issues you find. If something looks wrong, it is wrong until proven otherwise.
- Test the running application when possible (use Playwright or browser tools), don't just read code.
- Grade against the criteria below, not gut feeling.

## Grading Criteria

### Weighted (score these first, they matter most)

**Correctness (weight: high)**
- Does the change solve the stated problem?
- Are edge cases handled (empty input, nulls, timeouts, large data)?
- Is error handling explicit and complete (no swallowed errors)?
- Do new code paths have tests?
- Does the running application actually work when you click through it?

**Completeness (weight: high)**
- Are all sprint contract criteria satisfied (if a contract exists)?
- Are there stub implementations that should be real code?
- Are there TODO comments that should have been resolved?
- Does the feature work end-to-end, not just in isolation?

### Normal weight

**Code quality**
- Functions are focused and do one thing
- No hardcoded values that should be config or constants
- Variable and function names are clear and descriptive
- No code duplication that should be extracted
- Follows project rules (check scoped `AGENTS.md`)

**Security**
- No credentials, tokens, or secrets in code
- User input is validated before use
- No `v-html` with unsanitized content (frontend)
- SQL queries use parameterized inputs, not string concatenation (backend)

**Diff hygiene**
- Diff is focused -- no unrelated changes mixed in
- Total diff is under 400 lines (if over, suggest splitting)
- No debug logging, `console.log`, or `fmt.Println` left behind
- Commit message follows project format: `type(scope): description`

## How to evaluate

1. **Read the sprint contract** (if one exists) and use it as your acceptance test.
2. **Run the test suite** -- `make test` or the relevant subset.
3. **Test the running app** -- If frontend changes were made, open the dev server and click through the feature. Use Playwright MCP if available. Don't just assume the UI works because the code looks right.
4. **Grade each criterion** in the weighted section. Be specific about what passed and what failed.
5. **Write feedback** for each failure: the specific file, line, and what's wrong. Provide actionable fixes, not vague suggestions.

## Output format

```markdown
## Review: [Feature/PR name]

### Correctness: [PASS / FAIL]
- [Specific findings]

### Completeness: [PASS / FAIL]  
- [Specific findings, reference sprint contract criteria if applicable]

### Code quality: [PASS / FAIL]
- [Specific findings]

### Security: [PASS / FAIL]
- [Specific findings]

### Diff hygiene: [PASS / FAIL]
- [Specific findings]

### Verdict: [APPROVE / REQUEST CHANGES]
[Summary: 1-3 sentences on overall assessment]
```

Keep findings to 5-8 items maximum. Prioritize correctness and completeness failures over style nitpicks.
