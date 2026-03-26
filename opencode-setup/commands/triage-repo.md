---
description: Triage a repository from multiple angles in parallel
agent: build
subtask: true
---

You are running a repository triage. Spawn 4 parallel subagents using sessions_spawn with mode="run":

## Agent 1: Structure Analyst
Task: "Analyze the project structure. Identify: entry points, module organization, config files, build system. Report: directory tree, key files, architectural patterns used."

## Agent 2: Dependency Auditor
Task: "Analyze package.json / requirements.txt / go.mod. Identify: direct deps, dev deps, outdated packages, security vulnerabilities. Report: dep count, risk level, update recommendations."

## Agent 3: Test Coverage Analyst
Task: "Analyze the test suite. Identify: test framework, coverage %, test types (unit/integration/e2e), missing coverage areas. Report: coverage summary, gaps, test quality score."

## Agent 4: Documentation Analyst
Task: "Analyze documentation. Check: README, API docs, inline comments, examples. Report: doc completeness score, missing docs, quality of existing docs."

## After all 4 complete:
Consolidate into a single triage report with:
- Overall health score (1-10)
- Critical issues (must fix)
- Quick wins (easy improvements)
- Recommended next steps

The repository to triage: $ARGUMENTS or current working directory if not specified.
