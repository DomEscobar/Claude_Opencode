---
description: Analyze feature impact across API, database, and frontend in parallel
agent: build
subtask: true
---

You are running a feature impact analysis. Spawn 3 parallel subagents:

## Agent 1: API Impact Analyst
Task: "Analyze how this feature affects the API layer. Check: new endpoints needed, breaking changes, auth requirements, rate limiting, versioning, request/response schemas. Report: API changes, migration path, backwards compatibility."

## Agent 2: Database Impact Analyst
Task: "Analyze how this feature affects the data layer. Check: schema changes, migrations needed, indexing, query patterns, data integrity constraints, rollback strategy. Report: DB changes, migration steps, performance impact."

## Agent 3: Frontend Impact Analyst
Task: "Analyze how this feature affects the UI layer. Check: new components, state management, routing, API integration, UX considerations, accessibility. Report: UI changes, component breakdown, integration points."

## Consolidation:
After all 3 complete, produce:
- Dependency graph (which layers depend on which)
- Implementation order (what to build first)
- Breaking changes summary
- Estimated effort per layer
- Risk assessment

Feature to analyze: $ARGUMENTS
