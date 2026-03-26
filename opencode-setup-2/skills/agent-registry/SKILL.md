---
name: agent-registry
description: Complete registry of all available agents and when to use them
---

# Agent Registry

Quick reference for all available agents.

---

## 🔨 BUILDERS (Write Code)

| Agent | Description | When to Use |
|-------|-------------|-------------|
| `@build-aggressive` | Auto-executes without asking | Trusted env, rapid iteration |
| `@build-frontend` | React/Vue/CSS specialist | UI components, styling |
| `@build-backend` | API/DB specialist | Endpoints, queries, services |
| `@tdd-builder` | Test-first development | Any implementation, ensures tests |
| `@test-coverage-team` | Spawns test writers | Boost coverage on existing code |

---

## 📋 PLANNERS (Read-Only Analysis)

| Agent | Description | When to Use |
|-------|-------------|-------------|
| `@plan-architect` | Architecture decisions | New features, refactors |
| `@plan-security` | STRIDE threat modeling | Security audits, design review |
| `@plan-migration` | Safe DB migrations | Schema changes |
| `@plan-then-build` | Plan first, then implement | Non-trivial features |

---

## 🔍 REVIEWERS (Quality Checks)

| Agent | Description | When to Use |
|-------|-------------|-------------|
| `@multi-reviewer` | 3 parallel reviews | Comprehensive code review |
| `@security-review` | Security-focused audit | Security-sensitive code |
| `@code-reviewer` | Structured review | General code review |

---

## 🧭 EXPLORERS (Understanding Code)

| Agent | Description | When to Use |
|-------|-------------|-------------|
| `@arch-explorer` | Structure, deps, patterns | New codebase, architecture questions |
| `@research-team` | Parallel research | Market research, comparisons |

---

## 🛠 SPECIALISTS (Domain Experts)

| Agent | Description | When to Use |
|-------|-------------|-------------|
| `@api-designer` | REST/GraphQL design | New APIs |
| `@incident-responder` | Production issues | Debugging, post-mortems |
| `@migration-planner` | DB migrations | Schema changes |
| `@refactor-specialist` | Code smells, incremental refactors | Tech debt cleanup |
| `@doc-sprint` | Documentation | API docs, README, comments |
| `@onboarding-buddy` | New developer guidance | Onboarding, learning paths |

---

## 🎼 ORCHESTRATORS (Coordinate Agents)

| Agent | Description | When to Use |
|-------|-------------|-------------|
| `@orchestrator` | Master coordinator | Complex multi-agent tasks |
| `@reconciler` | Resolve conflicts | Conflicting agent outputs |

---

## Quick Selection

**I need to...**

- Build something fast → `@build-aggressive`
- Build something carefully → `@plan-then-build` or `@tdd-builder`
- Build frontend → `@build-frontend`
- Build backend → `@build-backend`
- Review code → `@multi-reviewer`
- Check security → `@plan-security`
- Understand codebase → `@arch-explorer`
- Fix a bug → `@tdd-builder` or `/fix` command
- Ship a feature → `/ship` command
- Audit code → `/audit` command
- Orchestrate complex task → `/orchestrate` command
