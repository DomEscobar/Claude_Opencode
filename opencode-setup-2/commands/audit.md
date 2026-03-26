---
description: Quick audit using parallel agents
agent: orchestrator
subtask: true
---

Quick audit: Spawn 3 agents in parallel to analyze from different angles.

## Agents to Spawn

1. **@plan-security** — Security vulnerabilities
2. **@multi-reviewer** — Code quality (security, performance, readability)
3. **arch-explorer** — Structure, dependencies, patterns

## Target

$ARGUMENTS (or current directory if not specified)

## Output

Combine all findings into a single audit report with:
- Critical issues (fix now)
- Important issues (fix soon)
- Minor suggestions (backlog)
- Overall health score (1-10)
