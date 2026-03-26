---
name: orchestration-patterns
description: Multi-agent orchestration patterns for complex workflows
---

# Orchestration Patterns

Patterns for coordinating multiple agents to solve complex tasks.

---

## 🎯 When to Orchestrate

| Task Complexity | Approach |
|-----------------|----------|
| Simple (1 task, 1 domain) | Single agent |
| Medium (2-3 tasks, related) | 2-3 agents parallel or sequential |
| Complex (4+ tasks, multiple domains) | Full orchestration with phases |

---

## 📊 Execution Patterns

### PARALLEL — Independent tasks
```
┌─ Agent A ─┐
├─ Agent B ─┼─→ Synthesize
└─ Agent C ─┘
```
**Use when:** No dependencies between subtasks

### SEQUENTIAL — Dependent tasks
```
Agent A → Agent B → Agent C
```
**Use when:** Each step depends on previous

### HYBRID — Most common
```
Phase 1 (parallel): Agent A + Agent B
Phase 2 (sequential): Agent C → Agent D
Phase 3 (parallel): Agent E + Agent F
```
**Use when:** Mix of independent and dependent tasks

---

## 🧠 Agent Selection Guide

### By Task Type
| Task | Agent | Mode |
|------|-------|------|
| Architecture design | `@plan-architect` | plan |
| Security analysis | `@plan-security` | plan |
| Frontend code | `@build-frontend` | build |
| Backend code | `@build-backend` | build |
| Tests | `@tdd-builder` | build |
| Code review | `@multi-reviewer` | verify |
| Exploration | `@arch-explorer` | explore |
| Research | `@research-team` | research |
| Migration | `@migration-planner` | plan |
| Refactoring | `@refactor-specialist` | build |
| Documentation | `@doc-sprint` | build |

### By Phase
| Phase | Agents |
|-------|--------|
| **Plan** | `@plan-architect`, `@plan-security`, `@plan-migration` |
| **Build** | `@build-frontend`, `@build-backend`, `@build-aggressive`, `@tdd-builder` |
| **Verify** | `@multi-reviewer`, `@security-review`, `@test-coverage-team` |
| **Explore** | `@arch-explorer`, `@research-team` |
| **Document** | `@doc-sprint`, `@readme-generator` |

---

## 🔄 Common Workflows

### New Feature
```
Plan → Build (backend → frontend) → Verify
```

### Bug Fix
```
Explore → Fix (TDD) → Verify
```

### Code Audit
```
Analyze (parallel: security + quality + structure) → Synthesize
```

### Migration
```
Plan migration → Review security → Execute → Verify
```

### Release
```
Check (parallel) → Prepare docs → Verify tests
```

---

## ⚠️ Orchestration Limits

- **Max parallel agents:** 5 (resource constraint)
- **Max sequential steps:** 10 (complexity limit)
- **Always verify critical results**
- **Ask user before destructive operations**

---

## 🎯 Success Criteria

An orchestration is successful when:
1. All subtasks are completed
2. Results are synthesized into unified output
3. User can act on the recommendation
4. No conflicts remain unresolved
