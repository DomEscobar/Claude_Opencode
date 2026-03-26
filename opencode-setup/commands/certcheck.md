---
description: SSL/TLS certificate checking - expiration dates, chain validation, and vulnerability scanning
agent: devops
tags: [ssl, tls, certificates, security, https]
---

# SSL Certificate Diagnostics

## Check Certificate for Domain
Provide a domain to check:
```bash
echo | openssl s_client -connect <domain>:443 -servername <domain> 2>/dev/null | openssl x509 -noout -dates -subject -issuer
```

## Common Certificate Locations
!`find /etc/ssl -name "*.pem" -o -name "*.crt" -o -name "*.key" 2>/dev/null | head -20`

## Let's Encrypt Certificates
!`find /etc/letsencrypt -name "*.pem" 2>/dev/null | head -10 && ls -la /etc/letsencrypt/live/ 2>/dev/null | head -10`

## Expiring Certificates (next 30 days)
Run this to find certs expiring soon:
```bash
find /etc/ssl -name "*.crt" -o -name "*.pem" 2>/dev/null | xargs -I{} sh -c 'echo "{}"; openssl x509 -in "{}" -noout -dates 2>/dev/null' | grep -B1 "notAfter" | grep -E "(notAfter|{})"
```

## Kubernetes Secrets (TLS certs)
!`kubectl get secrets -A 2>/dev/null | grep -i tls || echo "kubectl not available or no TLS secrets"`

## Docker TLS Config
!`grep -r "TLS\|SSL\|cert\|key" /etc/docker 2>/dev/null | head -10 || echo "No Docker TLS config"`

## SSL Labs Grade Check (requires external connectivity)
Test SSL configuration:
```bash
curl -s "https://api.ssllabs.com/api/v3/analyze?host=<domain>" 2>/dev/null | head -5
```

## What This Tells You
- Expiring certs = outage risk (renew 30 days before)
- Self-signed certs in prod = security risk
- Weak ciphers = vulnerability
- Missing chain certs = incomplete trust
