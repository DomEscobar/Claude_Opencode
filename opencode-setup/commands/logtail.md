---
description: Real-time log monitoring - tail with filtering, error highlighting, and pattern matching
agent: devops
tags: [logs, monitoring, debugging, tail, errors]
---

# Real-Time Log Monitoring

## System Journal (last 50 lines)
!`journalctl -n 50 --no-pager 2>/dev/null || echo "journalctl not available"`

## System Logs (last 50 lines)
!`tail -50 /var/log/syslog 2>/dev/null || tail -50 /var/log/messages 2>/dev/null || echo "No standard syslog found"`

## Auth Logs (last 30 lines)
!`tail -30 /var/log/auth.log 2>/dev/null || tail -30 /var/log/secure 2>/dev/null || echo "No auth log found"`

## Last 100 Lines of Application Log
!`find /var/log -name "*.log" -mtime -1 2>/dev/null | head -5 | xargs tail -20 2>/dev/null | tail -50`

## Grep for Errors in Logs
!`grep -i "error\|fatal\|exception" /var/log/syslog 2>/dev/null | tail -20 || grep -i "error" /var/log/messages 2>/dev/null | tail -20`

## Failed Login Attempts
!`grep -i "failed\|failure" /var/log/auth.log 2>/dev/null | tail -15 || echo "No failed logins visible"`

## Docker Container Logs (if docker available)
!`docker ps --format "{{.Names}}\t{{.Status}}" 2>/dev/null | head -10`

## Kernel Ring Buffer
!`dmesg | tail -30`

## What This Tells You
- Auth failures = potential intrusion attempts
- Error patterns = root cause of crashes
- Docker issues = container health
- Journalctl shows systemd-managed service output
