---
description: Disk usage analysis - find large files, directories, and storage bottlenecks
agent: devops
tags: [disk, storage, usage, space, cleanup]
---

# Disk Usage Analysis

## Mounted Filesystems
!`df -h | grep -v "tmpfs\|devtmpfs\|loop\|overlay" | head -20`

## Largest Directories in /var
!`du -sh /var/* 2>/dev/null | sort -hr | head -15`

## Largest Directories in /home
!`du -sh /home/* 2>/dev/null | sort -hr | head -15`

## Docker Disk Usage
!`docker system df 2>/dev/null && echo "---" && docker system prune -a --dry-run 2>/dev/null | head -20`

## Log Directory Sizes
!`du -sh /var/log/* 2>/dev/null | sort -hr | head -15`

## Find Large Files (>100MB) in /var
!`find /var -type f -size +100M 2>/dev/null | head -20 | xargs -I{} ls -lh {} 2>/dev/null`

## Find Large Files (>500MB) in /home
!`find /home -type f -size +500M 2>/dev/null | head -10 | xargs -I{} ls -lh {} 2>/dev/null`

## Inode Usage
!`df -i | grep -v "tmpfs\|devtmpfs\|loop" | head -10`

## Mount Options (check noatime, nodiratime)
!`cat /proc/mounts | grep -E "^/dev" | awk '{print $1, $2, $4}' | head -10`

## What This Tells You
- Disk near 100% = writes will fail
- Docker taking space = prune images
- Logs growing unbounded = logrotate missing
- Many small files = inode exhaustion risk
- Missing noatime = unnecessary disk writes
