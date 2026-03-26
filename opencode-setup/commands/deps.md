---
description: Check outdated packages and security advisories
agent: build
---

!`npm outdated 2>&1 || echo "No package.json or npm not found"`
!`npm audit 2>&1 || echo "No audit output"`

Prioritize findings by severity (critical > high > moderate). For each outdated or vulnerable package, briefly explain the risk and suggest: upgrade to specific version, find-alternative, or accept risk with justification.
