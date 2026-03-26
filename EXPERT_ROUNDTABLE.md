# OpenCode Expert Round Table — March 2026

4 experts ran in parallel: DevOps Engineer, Staff Architect, Platform Engineer, Toolsmith.
All results written to `~/.opencode/` (globally active immediately).

---

## COMMANDS — 10 created (`~/.opencode/commands/`)

| File | Purpose |
|------|---------|
| `sysdig.md` | CPU, memory, disk I/O, load average, top processes |
| `netinfo.md` | Network connections, ports, DNS, routing, firewall |
| `logtail.md` | Real-time syslog, auth, docker, kernel logs |
| `dockstat.md` | Docker container stats, logs, resource usage |
| `certcheck.md` | SSL/TLS cert expiration, chain validation |
| `pprof.md` | CPU, memory, I/O, network profiling |
| `which.md` | Binary discovery — tools, versions, PATH |
| `svc.md` | Systemd services, failed units, zombie processes |
| `diskuse.md` | Large files, Docker space, logs, inode usage |
| `secrets.md` | SSH keys, credentials, SUID binaries, vault status |

**Pattern:** Each uses `!`shell output injection`` to embed real live data.

---

## AGENTS — 8 created (`~/.opencode/agents/`)

| File | When to invoke |
|------|---------------|
| `api-designer.md` | `@api-designer` — REST/GraphQL design, OpenAPI specs |
| `incident-responder.md` | `@incident-responder` — war room, debugging, post-mortems |
| `test-strategist.md` | `@test-strategist` — test pyramids, TDD, flaky test playbook |
| `refactor-specialist.md` | `@refactor-specialist` — code smells, safe incremental refactors |
| `migration-specialist.md` | `@migration-specialist` — zero-downtime schema changes |
| `code-reviewer.md` | `@code-reviewer` — security, performance, maintainability review |
| `onboarding-buddy.md` | `@onboarding-buddy` — new dev onboarding, learning paths |
| `architecture-advisor.md` | `@architecture-advisor` — system design, trade-offs, patterns |

---

## SKILLS — 10 created (`~/.opencode/skills/`)

| Directory | Auto-loads when you say... |
|-----------|---------------------------|
| `db-schema-diff/` | "migration", "schema change", "database" |
| `api-design-review/` | "API design", "REST", "GraphQL", "endpoint" |
| `test-strategy/` | "write tests", "TDD", "test pyramid" |
| `observability-check/` | "logging", "traces", "SLO", "OpenTelemetry" |
| `incident-response/` | "incident", "on-call", "post-mortem", "alert" |
| `security-scan/` | "secret scan", "SAST", "CVE", "security" |
| `k8s-troubleshoot/` | "pod crash", "CrashLoop", "k8s", "kubernetes" |
| `infra-cost-estimate/` | "cost", "AWS sizing", "cloud pricing" |
| `script-scaffolder/` | "write a script", "bash", "CLI tool" |
| `git-bisect-hunt/` | "git bisect", "regression", "find bug" |

---

## TOOLS — 8 created (`~/.opencode/tools/`)

| File | What it does |
|------|-------------|
| `postgres-query.js` | Query PostgreSQL via `psql` (SELECT-only safe) |
| `http-request.js` | GET/POST/PUT/DELETE with headers, body, redirects |
| `git-log-graph.js` | ASCII commit graph with branch structure |
| `json-query.js` | jq-powered JSON/NDJSON file querying |
| `docker-ps-verbose.js` | Container stats with CPU%, memory%, health, ports |
| `cron-next.js` | Calculate next N cron execution times |
| `secret-scan.js` | Scan for API keys, tokens, passwords, private keys |
| `shell-run.js` | Structured shell command execution with safety |

---

## Installation Status

Everything is already at `~/.opencode/` — no symlinks needed.
Restart OpenCode and all commands, agents, skills, and tools are live.
