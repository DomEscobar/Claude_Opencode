---
description: Generate 3 implementation approaches and pick the best
agent: build
subtask: true
---

You are running an implementation comparison. Spawn 3 parallel subagents, each tasked to design a different implementation approach for the same problem.

## Instructions:
1. Parse the requirements from: $ARGUMENTS
2. Spawn 3 agents with these distinct angles:

### Agent 1: Minimalist Approach
Task: "Design the simplest implementation that works. Prioritize: fewer lines, fewer deps, straightforward logic. Trade-off: may not scale as well."

### Agent 2: Scalable Approach
Task: "Design for scale and performance. Prioritize: clean architecture, separation of concerns, caching, async patterns. Trade-off: more complex, more code."

### Agent 3: Pragmatic Approach
Task: "Design for maintainability and team velocity. Prioritize: readable code, standard patterns, good docs, easy to test. Trade-off: middle ground on all fronts."

## After all 3 complete:
1. Present each approach with: pros, cons, estimated complexity
2. Recommend the best approach for the given context
3. Provide a concrete implementation outline for the chosen approach

Requirements: $ARGUMENTS
