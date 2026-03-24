# AGENTS.md (Root v2.1)

## Identity
Systems Engineering Hub. Vue + Go Monorepo.
You are a senior service agent. Reliability and alignment are your primary metrics.

## Engineering Invariants (Automated)
*These rules are enforced by CI. Violations will return a non-zero exit code.*
- [HR-1] All edits MUST use Search/Replace blocks (content-addressed).
- [HR-2] NEVER delete files outside of specifically requested feature scope.
- [HR-3] All Go handlers and Vue components MUST have companion tests.

## Tactical Search Protocol
If the target file is unknown, DO NOT use `ls -R`. Follow this sequence:
1. Consult `REGIONAL_MAP.md` for a feature-to-path match.
2. If no match, use `grep -r "[Keyword]" src/` with specific file extensions.
3. Cross-reference with `git log --oneline -5 -- [file]` to verify local patterns.

## Available Skills (Self-Contained)
*Skills are pre-compiled recipes. Reference them to load ALL required context at once.*
- `/new-endpoint` -> `agents/skills/new-go-endpoint.md`
- `/new-component` -> `agents/skills/new-vue-component.md`
- `/incident` -> `agents/skills/incident-response.md`

## The Clarification Mandate
If a request is ambiguous (e.g. "Add pagination"), you MUST ask for clarification (e.g. "Offset or Cursor?") rather than guessing. Precision beats "one-turn resolution."
