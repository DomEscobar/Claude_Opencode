---
description: Security sweep with 4 parallel scanners
agent: build
subtask: true
---

You are running a security sweep. Spawn 4 parallel subagents:

## Agent 1: SAST Scanner
Task: "Run static analysis for security. Check: SQL injection, XSS, command injection, path traversal, SSRF, XXE, insecure deserialization, LDAP injection. Report: findings by severity, location, remediation."

## Agent 2: Secret Scanner
Task: "Scan for leaked secrets. Check: API keys, tokens, passwords, private keys, certificates in code, .env files committed, hardcoded credentials. Report: secrets found, type, location, rotation steps."

## Agent 3: Dependency Scanner
Task: "Scan dependencies for vulnerabilities. Check: known CVEs, outdated packages, malicious packages, license issues. Report: vulnerable deps, severity, safe version, fix command."

## Agent 4: Permission Auditor
Task: "Audit permissions and access. Check: file permissions, SUID binaries, sudo rules, container privileges, IAM roles, API scopes. Report: overprivileged items, least-violation fix."

## Consolidation:
After all 4 complete, produce:
- Security score (1-10)
- Critical vulnerabilities (fix immediately)
- High severity (fix this week)
- Medium/Low (backlog)
- Compliance checklist status

Target: $ARGUMENTS or current directory
