---
description: Workspace morning routine - check everything at once
agent: build
---

Run all checks in parallel and produce a single health summary:

!`git status --porcelain`
!`git log --oneline -5`
!`docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"`
!`systemctl list-units --type=service --state=running 2>/dev/null | grep -v systemd | head -20`
!`df -h / /home 2>/dev/null | tail -1`
!`cat /proc/meminfo 2>/dev/null | grep -E "MemTotal|MemAvailable" || echo "cannot read meminfo"`

For each section: status indicator (✅ 🟡 🔴), one-line summary, then detail if attention needed.
