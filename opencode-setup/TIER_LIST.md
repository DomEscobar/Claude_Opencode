# OpenCode Extension Tier List

> Generated March 2026 — 59 total extensions across commands, agents, skills, and tools.

---

## ⚡ S-TIER — Use Daily

### Commands

| Command | Description | Why S-Tier |
|---------|-------------|------------|
| `/commit` | Review staged changes, propose commit message | Every commit, every day |
| `/review` | Run tests + coverage, analyze failures | Every PR, every change |
| `/triage-repo` | 4 parallel agents analyze structure, deps, tests, docs | Understand any codebase in 5 min |
| `/code-audit` | 4 parallel agents: security, perf, complexity, coverage | Comprehensive health check |

### Agents

| Agent | Description | Why S-Tier |
|-------|-------------|------------|
| `@plan-then-build` | Plan first (read-only), confirm, then implement | Never break things again |
| `@build-aggressive` | Auto-executes without asking | Fast iteration in trusted env |
| `@tdd-builder` | Red → Green → Refactor cycle | Quality code, every time |
| `@multi-reviewer` | Spawns 3 review specialists (security, perf, readability) | Catch issues from 3 angles |

### Skills

| Skill | Description | Why S-Tier |
|-------|-------------|------------|
| `git-flow` | Branch naming, commit format, PR requirements | Loaded on every git task |

### Tools

| Tool | Description | Why S-Tier |
|------|-------------|------------|
| `git-log-graph` | ASCII commit graph with branch structure | See branch structure at a glance |
| `postgres-query` | Query PostgreSQL via psql (SELECT-only) | Query DB directly from chat |
| `http-request` | GET/POST/PUT/DELETE with full control | Test APIs without leaving OpenCode |

---

## 🥇 A-TIER — Use Weekly

### Commands

| Command | Description | When to Use |
|---------|-------------|-------------|
| `/start` | Morning routine: git, docker, disk, memory | Start of day, workspace health |
| `/release-check` | 5 agents: changelog, migrations, docs, tests, deprecations | Before every release |
| `/security-sweep` | 4 agents: SAST, secrets, deps, permissions | Weekly security audit |
| `/feature-impact` | 3 agents: API, DB, frontend impact analysis | Planning new features |

### Agents

| Agent | Description | When to Use |
|-------|-------------|-------------|
| `@plan-architect` | ADRs, diagrams, trade-offs, recommendations | Architecture decisions |
| `@plan-migration` | Safe DB migrations with rollback procedures | DB schema changes |
| `@incident-responder` | War room guidance, debugging, post-mortems | Production issues |
| `@build-frontend` | React/Vue/CSS specialist, component patterns | Frontend work |
| `@build-backend` | API/DB specialist, REST/GraphQL/ORM patterns | Backend work |

### Skills

| Skill | Description | When to Use |
|-------|-------------|-------------|
| `test-strategy` | Test pyramid, TDD patterns, flaky test playbook | Writing tests |
| `api-design-review` | REST/GraphQL patterns, pagination, error handling | API design |
| `incident-response` | On-call playbook, SLO/SLA definitions, runbooks | On-call, debugging |

### Tools

| Tool | Description | When to Use |
|------|-------------|-------------|
| `docker-ps-verbose` | Container stats with CPU%, memory%, health, ports | Container debugging |
| `secret-scan` | Scan for API keys, tokens, passwords, private keys | Pre-commit security check |
| `cron-next` | Calculate next N execution times for cron expression | Scheduling tasks |

---

## 🥈 B-TIER — Use Occasionally

### Commands

| Command | Description | When to Use |
|---------|-------------|-------------|
| `/bug-hunt` | 3 agents: logic bugs, edge cases, race conditions | Hunting elusive bugs |
| `/compare-implementations` | 3 approaches: minimalist, scalable, pragmatic | Choosing architecture |
| `/competitor-research` | 4 agents: pricing, features, positioning, reviews | Market research |
| `/doc-sprint` | 3 agents: API docs, README, inline comments | Documentation sprint |

### Agents

| Agent | Description | When to Use |
|-------|-------------|-------------|
| `@research-team` | Spawns 2-4 parallel research agents | Deep research tasks |
| `@arch-explorer` | 3 agents: structure, dependencies, patterns | Codebase exploration |
| `@test-coverage-team` | Spawns N test writers per module | Boosting coverage |

### Skills

| Skill | Description | When to Use |
|-------|-------------|-------------|
| `k8s-troubleshoot` | CrashLoopBackOff, OOMKilled, pending pods, networking | Kubernetes issues |
| `db-schema-diff` | Migration planning, safe patterns, rollback playbooks | Schema migrations |
| `observability-check` | Structured logging, OpenTelemetry, SLOs | Adding observability |

---

## 📊 Statistics

| Category | S-Tier | A-Tier | B-Tier | Total |
|----------|--------|--------|--------|-------|
| Commands | 4 | 4 | 4 | **20** |
| Agents | 4 | 5 | 3 | **21** |
| Skills | 1 | 3 | 3 | **10** |
| Tools | 3 | 3 | 0 | **8** |
| **Total** | **12** | **15** | **10** | **59** |

---

## 🎯 Your Daily Drivers

```
Commands:  /commit /review /triage-repo /code-audit
Agents:    @plan-then-build @tdd-builder @build-aggressive @multi-reviewer
Skills:    git-flow
Tools:     git-log-graph postgres-query http-request
```

---

## 📁 File Locations

All extensions are installed at `~/.opencode/`:

```
~/.opencode/
├── commands/     → /command-name
├── agents/       → @agent-name
├── skills/       → auto-loaded on topic
└── tools/        → LLM-callable functions
```

Backup/sync location: `/root/Claude_Opencode/opencode-setup/`

---

## 🚀 Quick Start

```bash
# Daily workflow
/review                    # Review current changes
/commit                    # Stage and commit

# Understand a new codebase
/triage-repo               # 5-minute analysis

# Quality check
/code-audit                # Comprehensive audit
@multi-reviewer review src/  # Multi-perspective review

# Planning new feature
/feature-impact add user auth
@plan-architect design the auth system

# Testing
@tdd-builder implement user registration
```
