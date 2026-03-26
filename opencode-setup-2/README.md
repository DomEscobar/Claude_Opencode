# OpenCode Setup 2 — Orchestrator System

> Multi-agent orchestration layer for complex workflows.

---

## 🎯 What This Is

This setup provides the **orchestration layer** for OpenCode — agents that coordinate other agents.

Instead of manually invoking `@build-backend` then `@build-frontend` then `@tdd-builder`, you use:

```
/ship implement user authentication
```

The orchestrator decomposes, schedules, and executes the full workflow.

---

## 📁 Structure

```
opencode-setup-2/
├── agents/
│   ├── orchestrator.md        # Master coordinator
│   ├── reconciler.md          # Conflict resolution
│   └── workflow-patterns.md   # Reusable patterns
├── commands/
│   ├── orchestrate.md         # /orchestrate — custom orchestration
│   ├── audit.md               # /audit — quick parallel audit
│   ├── ship.md                # /ship — full feature workflow
│   └── fix.md                 # /fix — bug fix workflow
├── skills/
│   ├── orchestration-patterns/ # Execution patterns guide
│   └── agent-registry/         # All agents reference
└── README.md
```

---

## 🚀 Quick Start

### Install
```bash
# Copy to your OpenCode config
cp -r opencode-setup-2/* ~/.opencode/
```

### Use

```bash
# Orchestrate any complex task
/orchestrate build a user management system with roles and permissions

# Quick audit (3 agents parallel)
/audit src/auth

# Ship a feature (plan → build → verify)
/ship implement password reset

# Fix a bug (investigate → fix → verify)
/fix users can't login with special characters in password
```

---

## 🎼 The Orchestrator

The `@orchestrator` agent is the brain. It:

1. **Understands** your request
2. **Decomposes** into subtasks
3. **Selects** the right agents
4. **Schedules** parallel vs sequential phases
5. **Spawns** subagents
6. **Synthesizes** results

### Example Orchestration

```
User: "Build user authentication"

Orchestrator decomposes:
  Phase 1 (parallel):
    - @plan-architect: Design auth architecture
    - @plan-security: Identify security requirements

  Phase 2 (sequential):
    - @build-backend: Implement auth API
    - @build-frontend: Implement login UI

  Phase 3 (parallel):
    - @tdd-builder: Write tests
    - @multi-reviewer: Review code

  Result: Synthesized report with implementation complete
```

---

## 🔄 Workflow Patterns

Built-in patterns for common tasks:

| Pattern | Command | Phases |
|---------|---------|--------|
| New Feature | `/ship` | Plan → Build → Verify |
| Bug Fix | `/fix` | Investigate → Fix → Verify |
| Code Audit | `/audit` | Analyze (parallel) → Synthesize |
| Custom | `/orchestrate` | Auto-determined |

---

## 🧠 Agent Registry

All available agents organized by role:

**Builders:** `@build-aggressive` `@build-frontend` `@build-backend` `@tdd-builder`

**Planners:** `@plan-architect` `@plan-security` `@plan-migration`

**Reviewers:** `@multi-reviewer` `@security-review` `@code-reviewer`

**Explorers:** `@arch-explorer` `@research-team`

**Orchestrators:** `@orchestrator` `@reconciler`

---

## 📊 Execution Patterns

### Parallel (faster)
```
┌─ Agent A ─┐
├─ Agent B ─┼─→ Synthesize
└─ Agent C ─┘
```

### Sequential (safer)
```
Agent A → Agent B → Agent C
```

### Hybrid (most common)
```
Phase 1: Parallel (Plan)
Phase 2: Sequential (Build)
Phase 3: Parallel (Verify)
```

---

## ⚠️ Limits

- Max 5 agents parallel
- Max 10 sequential steps
- Always verify critical results
- Ask before destructive operations

---

## 🔗 Requires

This setup works with the agents from `opencode-setup/`. Install both:

```bash
cp -r opencode-setup/* ~/.opencode/
cp -r opencode-setup-2/* ~/.opencode/
```

---

## 📖 Learn More

- `skills/agent-registry/SKILL.md` — All agents and when to use them
- `skills/orchestration-patterns/SKILL.md` — Execution patterns
- `agents/workflow-patterns.md` — Predefined workflows

---

**The orchestrator is the conductor. The specialists are the orchestra. Make beautiful music.**
