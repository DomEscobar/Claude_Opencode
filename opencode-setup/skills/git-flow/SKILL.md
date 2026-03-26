---
name: git-flow
description: Git workflow conventions for this workspace
---

## Branch Naming
- `feature/<short-description>`
- `fix/<short-description>`
- `chore/<short-description>`
- `docs/<short-description>`
- `refactor/<short-description>`

## Commit Format
```
<type>(<scope>): <description>

[optional body]
```

**Types:**
- `feat` — new feature
- `fix` — bug fix
- `docs` — documentation only
- `style` — formatting, no code change
- `refactor` — restructuring without behavior change
- `test` — adding or updating tests
- `chore` — maintenance, deps, build changes

**Rules:**
- Subject line ≤ 72 chars
- Use imperative mood ("add" not "added")
- No period at end of subject
- Reference issue numbers in body if applicable

## PR Requirements
- Must pass CI
- Requires 1 review approval
- Squash merge to main
- Title follows commit format

## Tags
Use semantic versioning: `v1.2.3` (major.minor.patch)
