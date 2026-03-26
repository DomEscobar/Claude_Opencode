---
name: opencode-extensions
description: Custom commands, agents, skills and tools available in this OpenCode setup
---

This workspace has custom extensions at `~/.opencode/` and `~/.config/opencode/`.

## Available Commands
Type `/` then the name to invoke:

| Command | What it does |
|---|---|
| `/review` | Run tests + coverage, analyze failures |
| `/commit` | Review staged changes, propose commit message |
| `/deps` | Check outdated packages and npm audit |
| `/logs [svc]` | Show recent journal/docker logs |
| `/start` | Morning health check: git, docker, disk, memory |
| `/backup` | Rsync snapshot to $BACKUP_TARGET |
| `/docker-clean` | Prune stopped containers and dangling images |
| `/translate-po <file.po> <locale>` | Translate fuzzy/empty .po entries |

## Available Agents
Invoke with `@name` in any message:

| Agent | When to use |
|---|---|
| `@security-review` | Audit code for vulnerabilities |
| `@adr-writer` | Write an Architecture Decision Record |
| `@readme-generator` | Generate or improve README.md |
| `@architecture-review` | Analyze project structure and health |

## Available Skills
Loaded automatically when relevant topics arise:

| Skill | Triggers |
|---|---|
| `git-flow` | Git, PRs, commits, branching |
| `docker-compose` | Docker, compose, containers |
| `opencode-extensions` | Questions about these extensions |

## Custom Tools
Available to all agents:

| Tool | What it does |
|---|---|
| `docker_stats` | Live container CPU/memory/network stats |
| `render_video` | Trigger a video render |
| `immoscout_query` | Query apartment scan results |

## File Locations
- Commands: `~/.opencode/commands/*.md` or `~/.config/opencode/commands/`
- Agents: `~/.opencode/agents/*.md` or `~/.config/opencode/agents/`
- Skills: `~/.opencode/skills/*/SKILL.md` or `~/.config/opencode/skills/`
- Tools: `~/.opencode/tools/*.js` or `~/.config/opencode/tools/`
