---
description: Network diagnostics - connections, listening ports, DNS, routing, and firewall rules
agent: devops
tags: [network, networking, ports, firewall, connectivity]
---

# Network Diagnostics

## Listening Services
!`ss -tulnp | grep -v "State\|recving\|LISTEN" | column -t`

## Active TCP Connections
!`ss -tn | awk 'NR>1 {print $1,$2,$3,$4}' | column -t | head -20`

## Connection States Summary
!`ss -tan | awk '{print $1}' | sort | uniq -c | sort -rn`

## DNS Resolution Test
!`nslookup google.com 8.8.8.8 2>/dev/null || dig +short google.com @8.8.8.8`

## Default Gateway & Routing
!`ip route show default && echo "---" && ip route | grep -E "default|via" | head -5`

## Firewall Rules (if iptables exists)
!`iptables -L -n --line-numbers 2>/dev/null | head -30 || echo "iptables not accessible"`

## Network Interfaces
!`ip addr show | grep -E "^[0-9]+:|inet " | tr -d ':' | awk '{print $1, $2}' | column -t`

## Latency Check
!`ping -c 3 8.8.8.8 2>&1 | tail -3`

## What This Tells You
- Which services are exposed (LISTEN on 0.0.0.0 = public)
- Connection saturation (TIME_WAIT pileup = app issue)
- DNS working? Routing correct?
