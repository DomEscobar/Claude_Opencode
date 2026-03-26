---
description: Generate documentation in parallel: API, README, inline
agent: build
subtask: true
---

You are running a documentation sprint. Spawn 3 parallel subagents:

## Agent 1: API Documentation
Task: "Generate API docs for: $ARGUMENTS. Include: endpoint descriptions, request/response schemas, auth requirements, error codes, examples, rate limits. Format: OpenAPI-compatible markdown."

## Agent 2: README Documentation
Task: "Generate/update README for: $ARGUMENTS. Include: project description, quick start, installation, usage examples, configuration, contributing, license. Keep it concise but complete."

## Agent 3: Inline Documentation
Task: "Add inline comments to: $ARGUMENTS. Focus on: complex functions, non-obvious logic, business rules, edge cases, TODOs. Use JSDoc/docstring format. Don't over-comment obvious code."

## Consolidation:
After all 3 complete, produce:
- Files created/updated
- Documentation coverage score
- Missing documentation areas
- Recommended next steps

Target: $ARGUMENTS
