# Skill: Code Review

## When to use
Before submitting a change, or when asked to review a diff, PR, or another agent's work.

## Checklist

### Correctness
- [ ] Does the change solve the stated problem?
- [ ] Are edge cases handled (empty input, nulls, timeouts, large data)?
- [ ] Is error handling explicit and complete (no swallowed errors)?
- [ ] Do new code paths have tests?

### Project Rules
- [ ] Follows scoped `AGENTS.md` rules for the affected module?
- [ ] Uses established patterns (check the Examples section in the relevant `AGENTS.md`)?
- [ ] No anti-patterns from the Anti-Patterns section?

### Code Quality
- [ ] Functions are focused and do one thing
- [ ] No hardcoded values that should be config or constants
- [ ] Variable and function names are clear and descriptive
- [ ] No code duplication that should be extracted

### Security
- [ ] No credentials, tokens, or secrets in code
- [ ] User input is validated before use
- [ ] No `v-html` with unsanitized content (frontend)
- [ ] SQL queries use parameterized inputs, not string concatenation (backend)

### Diff Hygiene
- [ ] Diff is focused -- no unrelated changes mixed in
- [ ] Total diff is under 400 lines (if over, suggest splitting)
- [ ] No debug logging, `console.log`, or `fmt.Println` left behind
- [ ] Commit message follows project format: `type(scope): description`

## How to use this
Run through the checklist item by item. For each failure, note the specific file and line. Provide actionable feedback, not vague suggestions.

Keep review comments to 5-8 items maximum. Prioritize critical issues over style nitpicks.
