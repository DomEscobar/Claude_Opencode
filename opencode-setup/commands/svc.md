---
description: Service management - systemd, init.d, process supervision
agent: devops
tags: [systemd, services, process, init, supervision]
---

# Service Management

## Running Services
!`systemctl list-units --type=service --state=running 2>/dev/null | head -30 || echo "systemctl not available"`

## Failed Services
!`systemctl --failed --type=service 2>/dev/null | head -20 || echo "systemctl not available"`

## Service Status (provide service name)
```bash
systemctl status <service-name> 2>/dev/null
```

## All Enabled Services
!`systemctl list-unit-files --type=service --state=enabled 2>/dev/null | head -30 || echo "systemd not available"`

## Top Memory-Consuming Processes
!`ps aux --sort=-%mem | head -10`

## Top CPU-Consuming Processes
!`ps aux --sort=-%cpu | head -10`

## Zombie Processes
!`ps aux | awk '$8 ~ /Z/ {print}' 2>/dev/null | head -10`

## Process Tree
!`pstree -p 2>/dev/null | head -30 || ps auxf | head -40`

## Open File Descriptors per Process
!`ls /proc/*/fd 2>/dev/null | wc -l && echo "---" && for p in $(ls /proc | grep "^[0-9]" | head -10); do echo -n "$p: "; ls /proc/$p/fd 2>/dev/null | wc -l; done`

## What This Tells You
- Failed services = broken dependencies or config
- Zombie processes = parent not harvesting children
- FD count explosion = file descriptor leak
- Services not enabled = won't start on reboot
