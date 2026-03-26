---
description: System diagnostics - CPU, memory, disk I/O, load average, and top processes
agent: devops
tags: [system, diagnostics, cpu, memory, monitoring]
---

# System Diagnostics

## Quick Health Check
!`uptime && echo "---" && free -h && echo "---" && df -h | grep -v "tmpfs\|devtmpfs\|loop" | tail -10`

## Top Processes by CPU
!`ps aux --sort=-%cpu | head -15`

## Top Processes by Memory  
!`ps aux --sort=-%mem | head -15`

## Load Average Context
!`cat /proc/loadavg && echo "Cores: $(nproc)" && echo "Load per core: $(awk '{print $1/nproc}' /proc/loadavg)"`

## Memory Details
!`cat /proc/meminfo | grep -E "^(MemTotal|MemFree|MemAvailable|Buffers|Cached|Active|Inactive):" && echo "---Swap---" && cat /proc/meminfo | grep -E "^(SwapTotal|SwapFree):"`

## Disk I/O Stats
!`iostat -x 1 2 2>/dev/null | tail -20 || cat /proc/diskstats | awk '{print $1,$3,$4,$6,$7,$10,$11}' | column -t | head -20`

## What This Tells You
- Load average vs CPU cores (load > cores = pressure)
- Memory: available vs total (watch for swapping)
- Disk I/O: %util near 100% = bottleneck
