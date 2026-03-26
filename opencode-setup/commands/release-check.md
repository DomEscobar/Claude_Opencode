---
description: Pre-release checklist with 5 parallel agents
agent: build
subtask: true
---

You are running a release readiness check. Spawn 5 parallel subagents:

## Agent 1: Changelog Generator
Task: "Analyze commits since last release. Generate: changelog with categories (features, fixes, breaking, deprecated). Format for GitHub releases."

## Agent 2: Migration Checker
Task: "Check all migration files. Verify: reversible, tested, no data loss, backwards compatible. Report: migration safety score, rollback steps."

## Agent 3: Documentation Checker
Task: "Verify documentation is updated. Check: README, API docs, migration guide, deprecation notices. Report: missing docs, outdated sections."

## Agent 4: Test Validator
Task: "Run full test suite. Check: all tests pass, coverage maintained, no flaky tests, integration tests work. Report: test status, failures, coverage delta."

## Agent 5: Deprecation Auditor
Task: "Check for deprecated codepaths. Verify: deprecation warnings added, migration docs exist, timeline communicated. Report: deprecations, removal schedule."

## Consolidation:
After all 5 complete, produce:
- Release readiness score (READY / NOT READY / READY WITH WARNINGS)
- Blocking issues (must fix before release)
- Recommended actions
- Suggested release notes

Version/context: $ARGUMENTS or "next release"
