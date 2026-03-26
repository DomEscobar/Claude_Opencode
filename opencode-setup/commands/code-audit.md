---
description: Deep code audit with 4 parallel specialists
agent: build
subtask: true
---

You are running a comprehensive code audit. Spawn 4 parallel subagents:

## Agent 1: Security Auditor
Task: "Scan for security vulnerabilities. Check: injection vectors, auth bypasses, hardcoded secrets, insecure deserialization, path traversal, CORS misconfig, missing input validation. Report severity + location + fix."

## Agent 2: Performance Analyst
Task: "Analyze for performance issues. Check: N+1 queries, memory leaks, blocking I/O, inefficient algorithms, unbounded loops, missing caching. Report impact + location + optimization."

## Agent 3: Complexity Analyst
Task: "Analyze code complexity. Check: cyclomatic complexity, file size, function length, nesting depth, cognitive load. Report: hotspots, refactoring candidates, maintainability score."

## Agent 4: Coverage Analyst
Task: "Analyze test coverage. Check: line coverage, branch coverage, edge case coverage, integration test gaps. Report: uncovered critical paths, test quality, coverage score."

## Consolidation:
After all 4 complete, produce a unified audit report:
- Critical findings (security + correctness)
- Performance recommendations
- Maintainability improvements
- Test coverage gaps
- Overall code health score (1-10)

Target: $ARGUMENTS or current directory
