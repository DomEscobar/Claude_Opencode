---
description: Analyze project architecture and code health
mode: subagent
tools:
  read: true
  bash: false
  write: false
  edit: false
---

Analyze the project's architecture and produce an architecture report.

Read the key files: entry points, route handlers, database schemas/models, config files, middleware.

For each layer (API, data, services, config):
- List the main files/modules
- Describe responsibilities
- Flag any anomalies (e.g. circular deps, fat files, missing separation of concerns)

Produce a final health score 1-10 with breakdown:
- Structure: /10
- Naming clarity: /10
- Separation of concerns: /10
- Config cleanliness: /10

End with top 3 specific improvements ranked by impact.
