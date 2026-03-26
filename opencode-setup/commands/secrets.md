---
description: Secret scanning and security diagnostics
agent: devops
tags: [security, secrets, scanning, credentials, vault]
---

# Secret & Security Scanning

## Recently Modified Files (potential compromise)
!`find / -type f -mtime -1 2>/dev/null | grep -v "proc\|sys\|run\|snap" | head -30`

## SSH Keys Present
!`find /home -name "*.pem" -o -name "id_*" -o -name "authorized_keys" 2>/dev/null | head -20`

## World-Readable Files with Sensitive Names
!`find /etc -name "*passw*" -o -name "*secret*" -o -name "*credential*" 2>/dev/null | xargs ls -la 2>/dev/null | head -20`

## Exposed Docker Sockets
!`find /var/run -name "docker.sock" -o -name "containerd.sock" 2>/dev/null | xargs ls -la 2>/dev/null`

## Environment Variables with Secrets
!`cat /proc/*/environ 2>/dev/null | tr '\0' '\n' | grep -iE "password|secret|token|key|credential" | head -20`

## Kubernetes Secrets (if accessible)
!`kubectl get secrets -A 2>/dev/null | head -20 || echo "kubectl not accessible"`

## Vault Status (if vault installed)
!`vault status 2>/dev/null || echo "vault not installed or not accessible"`

## sudo Permissions
!`cat /etc/sudoers 2>/dev/null | grep -v "^#" | grep -v "^$" | head -20`

## SUID Binaries (potential privilege escalation)
!`find /usr -type f -perm -4000 2>/dev/null | head -20`

## What This Tells You
- Recently modified files = potential breach
- SSH keys with bad permissions = security risk
- Exposed Docker socket = container escape vector
- Many SUID binaries = larger attack surface
- sudoers misconfig = privilege escalation path
