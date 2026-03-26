---
description: Docker container stats, logs, and resource usage
agent: devops
tags: [docker, containers, monitoring, kubernetes, runtime]
---

# Docker Diagnostics

## Running Containers
!`docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}" 2>/dev/null || echo "Docker not running or not accessible"`

## Container Resource Usage
!`docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}" 2>/dev/null || echo "docker stats unavailable"`

## All Containers (including stopped)
!`docker ps -a --format "{{.Names}}\t{{.Status}}\t{{.CreatedAt}}" 2>/dev/null | head -20`

## Docker Disk Usage
!`docker system df 2>/dev/null`

## Docker Version & Info
!`docker version --format "{{.Server.Version}}" 2>/dev/null && echo "Docker is running" || echo "Docker daemon not accessible"`

## Container Inspect Summary (if container name provided)
Run with a container name to inspect specific container:
```bash
docker inspect --format='{{.Name}} {{.State.Status}} {{.Config.Image}} {{.NetworkSettings.IPAddress}}' <container_name>
```

## Docker Logs (last 50 lines, all containers)
!`for c in $(docker ps --format "{{.Names}}" 2>/dev/null | head -5); do echo "=== $c ==="; docker logs --tail 10 $c 2>&1 | tail -5; done`

## Docker Events Stream (last 20)
!`docker events --since "10m" 2>/dev/null | tail -20 || echo "docker events unavailable"`

## What This Tells You
- CPU/Mem pressure per container
- Zombie or exited containers consuming resources
- Image bloat (docker system df)
- Which containers are fighting for resources
