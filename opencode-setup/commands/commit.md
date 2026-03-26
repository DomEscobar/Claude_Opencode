---
description: Review staged changes and propose a commit
agent: build
---

Analyze the currently staged changes and suggest:
1. A commit type (feat | fix | docs | style | refactor | test | chore)
2. A concise commit message in the format: <type>(<scope>): <description>
3. Whether the change warrants a body explaining motivation or consequences

Current staged diff:
!`git diff --staged --stat`
!`git diff --staged`

If everything looks good, offer to run: git commit -m "<message>"
