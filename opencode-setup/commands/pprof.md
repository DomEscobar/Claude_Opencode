---
description: Performance profiling - CPU, memory, I/O profiling and bottleneck identification
agent: devops
tags: [performance, profiling, pprof, bottleneck, optimization]
---

# Performance Profiling

## Current System Load
!`uptime && echo "---" && cat /proc/loadavg`

## Top CPU Consumers
!`top -bn1 | head -20 && echo "---" && ps aux --sort=-%cpu | head -10`

## Top Memory Consumers
!`free -h && echo "---" && ps aux --sort=-%mem | head -10`

## I/O Wait Analysis
!`iostat -x 1 2 2>/dev/null | tail -15 || cat /proc/diskstats | head -10`

## Context Switch Rate
!`vmstat 1 5 2>/dev/null | tail -5 || cat /proc/stat | grep "ctxt\|process" | head -5`

## Network Traffic
!`cat /proc/net/dev | tail -10 && echo "---" && ip -s link show 2>/dev/null | head -20`

## TCP Retransmits
!`netstat -s 2>/dev/null | grep -i "retransmit\|reassembly\|packet loss" | head -10`

##索Kernel Latency (if perf available)
!`perf list 2>/dev/null | head -10 || echo "perf not available - install linux-tools"`

## Go PPROF (if available)
For Go applications, enable pprof endpoints:
```bash
# Add to your Go app
import _ "net/http/pprof"
# Then:
go tool pprof http://localhost:6060/debug/pprof/profile
```

## What This Tells You
- High iowait = disk bottleneck
- High ctx switches = kernel pressure
- Retransmits = network issues
-perf list shows available profiling events
