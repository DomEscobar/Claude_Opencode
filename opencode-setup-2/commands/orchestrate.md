---
description: Orchestrate a complex task with multiple agents
agent: orchestrator
subtask: true
---

You are running the Orchestrator.

## Process

1. **Parse the request**: Understand what the user wants
2. **Decompose**: Break into subtasks
3. **Select agents**: Match subtasks to specialists
4. **Schedule**: Determine parallel vs sequential phases
5. **Spawn**: Invoke subagents with focused context
6. **Synthesize**: Combine results into unified response

## User Request

$ARGUMENTS

---

## Instructions

If the request is:
- **Simple** (single clear task) → Select one agent and explain why
- **Medium** (2-3 subtasks) → Show orchestration plan, then execute
- **Complex** (4+ subtasks) → Show detailed plan, ask for confirmation, then execute

Always explain your orchestration decisions.
