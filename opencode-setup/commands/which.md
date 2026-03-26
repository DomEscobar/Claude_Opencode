---
description: Find binaries, their versions, and dependencies
agent: devops
tags: [binaries, which, version, tools, dependencies]
---

# Binary & Tool Discovery

## Common DevOps Tool Locations
!`for t in docker kubectl helm terraform ansible terraforming vault jenkins git gradle maven npm node python python3 go ruby java perl php; do which $t 2>/dev/null && echo "$t: $($t --version 2>/dev/null | head -1)"; done | grep -v "^$" | head -30`

## All PATH Directories
!`echo "$PATH" | tr ':' '\n' | head -20`

## Recent Binaries in /usr/local/bin
!`ls -lt /usr/local/bin 2>/dev/null | head -15`

## System Python Packages
!`pip3 list 2>/dev/null | head -20 || pip list 2>/dev/null | head -20`

## Node.js Packages (global)
!`npm list -g --depth=0 2>/dev/null | head -20 || echo "npm not available"`

## Go Installation
!`go version 2>/dev/null && echo "GOPATH: $GOPATH" && go env GOROOT GOPATH 2>/dev/null`

## kubectl Context & Clusters
!`kubectl config current-context 2>/dev/null && kubectl cluster-info 2>/dev/null | head -5`

## Terraform Version & Providers
!`terraform version 2>/dev/null | head -5 && echo "---" && ls ~/.terraform.d 2>/dev/null | head -5`

## AWS CLI & Credentials
!`aws --version 2>/dev/null && aws configure list 2>/dev/null | head -10`

## What This Tells You
- What tools are installed (and versions)
- PATH pollution or misconfigurations
- Python/Node dependency versions
- Cloud CLI access credentials present
