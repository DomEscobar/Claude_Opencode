---
description: Show recent log entries for a service
---

!`journalctl --since "1 hour ago" --no-pager 2>/dev/null | tail -50`
!`docker logs $(docker ps --format "{{.Names}}" | head -5) 2>/dev/null | tail -30 || echo "No docker containers"`

Summarize errors, warnings, and any patterns. Group by frequency. Flag anything that looks like a crash loop, OOM kill, or failed healthcheck.
