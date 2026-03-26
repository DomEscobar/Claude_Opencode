---
description: Hunt bugs from 3 different angles in parallel
agent: build
subtask: true
---

You are running a bug hunt. Spawn 3 parallel subagents:

## Agent 1: Logic Bug Hunter
Task: "Hunt logic bugs in: $ARGUMENTS. Check: off-by-one errors, wrong operators, missing null checks, incorrect conditionals, state machine bugs, missing edge cases. Report: bugs found, severity, fix."

## Agent 2: Edge Case Hunter
Task: "Hunt edge case bugs in: $ARGUMENTS. Check: empty inputs, max inputs, special characters, unicode, timezones, concurrent access, resource exhaustion. Report: edge cases, expected vs actual, fix."

## Agent 3: Race Condition Hunter
Task: "Hunt concurrency bugs in: $ARGUMENTS. Check: shared state without locks, TOCTOU, deadlocks, missing synchronization, async/await bugs, event loop issues. Report: race conditions, reproduction steps, fix."

## Consolidation:
After all 3 complete, produce:
- Total bugs found (by category)
- Severity ranking (critical > high > medium > low)
- Quick wins (easy fixes)
- Complex fixes (need careful implementation)
- Test cases to add

Target code: $ARGUMENTS
