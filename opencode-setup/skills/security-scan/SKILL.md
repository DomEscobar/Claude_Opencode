---
name: security-scan
description: >
  Use when performing security audits, handling secrets, input validation,
  dependency vulnerabilities, or writing secure code patterns.
  Triggers on: "security audit", "secret scanning", "SQL injection", "XSS",
  "CSRF", "CORS", "authentication", "authorization", "OWASP", "dependency audit",
  "CVE", "vulnerability scan", "SAST", "DAST", "hardcoded secrets", "JWT security",
  "input validation", "RCE", "SSRF", "path traversal", "secure coding", "pen test".
---

# Security Scan Skill

## Decision Tree — What Are You Doing?

```
Auditing code for security issues?
  → Go to: SAST CHECKLIST
Scanning for secrets/credentials in code?
  → Go to: SECRET SCANNING
Checking dependencies for CVEs?
  → Go to: DEPENDENCY AUDIT
Reviewing an API for auth/authz issues?
  → Go to: API AUTH REVIEW
Handling a disclosed vulnerability?
  → Go to: VULNERABILITY RESPONSE
Writing secure code from scratch?
  → Go to: SECURE CODING PATTERNS
```

---

## SAST CHECKLIST (Static Application Security Testing)

### Manual code review — top findings in order of severity:

#### 1. Injection (SQL, NoSQL, OS, LDAP, XSS, SSTI)
```python
# ❌ SQL Injection — never interpolate user input into SQL
query = f"SELECT * FROM users WHERE email = '{user_email}'"  # DANGEROUS

# ✅ Parameterized query
query = "SELECT * FROM users WHERE email = %s"
cursor.execute(query, (user_email,))

# ✅ ORM (SQLAlchemy — automatically parameterized)
user = session.query(User).filter(User.email == user_email).first()

# ❌ Command Injection (OS)
os.system(f"grep {user_input} logfile.txt")  # DANGEROUS

# ✅ Use subprocess with list
subprocess.run(["grep", user_input, "logfile.txt"])  # safe

# ❌ XSS — reflecting user input in HTML without escaping
return f"<h1>Hello {name}</h1>"  # DANGEROUS if name = "<script>..."

# ✅ HTML escape (Jinja2 auto-escapes in templates by default — don't disable)
# In APIs: always return JSON, not HTML
return jsonify({"message": name})  # safe — JSON can't contain HTML
```

#### 2. Authentication & Session Management
```python
# ❌ Weak JWT secret — never hardcode
JWT_SECRET = "secret123"  # DANGEROUS

# ✅ From environment, with HS256 minimum
import os
JWT_SECRET = os.environ.get("JWT_SECRET")
if not JWT_SECRET or len(JWT_SECRET) < 32:
    raise ValueError("JWT_SECRET must be at least 32 characters")

# ❌ JWT with no expiration
token = jwt.encode({"user_id": user.id}, JWT_SECRET, algorithm="HS256")  # No exp!

# ✅ Always set expiration
token = jwt.encode(
    {"user_id": user.id, "exp": datetime.utcnow() + timedelta(hours=1)},
    JWT_SECRET,
    algorithm="HS256"
)

# ❌ Storing passwords in plain text
db.save({"email": email, "password": password})  # DANGEROUS

# ✅ bcrypt hashing (always use a proper password hashing library)
import bcrypt
hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
if not bcrypt.checkpw(password, hashed):
    raise AuthError()
```

#### 3. SSRF (Server-Side Request Forgery)
```python
# ❌ Allowing user to control the URL your server fetches
url = request.json["webhook_url"]
response = requests.get(url)  # Could be: http://169.254.169.254/

# ✅ Validate URL is not a private IP or cloud metadata endpoint
import ipaddress
from urllib.parse import urlparse

def is_safe_url(url_str: str) -> bool:
    parsed = urlparse(url_str)
    if parsed.scheme not in ("http", "https"):
        return False
    try:
        # DNS resolve to check actual IP (don't just check hostname)
        resolved = socket.gethostbyname(parsed.hostname)
        ip = ipaddress.ip_address(resolved)
        if ip.is_private or ip.is_loopback or ip.is_link_local:
            return False
        if ip == ipaddress.ip_address("169.254.169.254"):
            return False
        return True
    except (ValueError, socket.gaierror):
        return False

# ✅ Allowlist domains if possible
ALLOWED_WEBHOOK_DOMAINS = {"api.stripe.com", "hooks.slack.com"}
```

#### 4. Path Traversal
```python
# ❌ User controls file path
filepath = f"/uploads/{request.json['filename']}"
with open(filepath, 'rb') as f:  # Could be ../../../etc/passwd

# ✅ Sanitize and validate
from pathlib import Path
import re

def safe_filepath(filename: str, base_dir: str = "/uploads") -> Path:
    filename = filename.replace('\x00', '')
    filename = re.sub(r'[/\\]', '', filename)
    if not re.match(r'^[a-zA-Z0-9._-]+$', filename):
        raise ValueError("Invalid filename")
    base = Path(base_dir).resolve()
    filepath = (base / filename).resolve()
    if not str(filepath).startswith(str(base)):
        raise ValueError("Path traversal attempt detected")
    return filepath
```

---

## SECRET SCANNING

### Patterns to detect:
```
AWS_ACCESS_KEY:        AKIA[0-9A-Z]{16}
AWS_SECRET_KEY:       (?i)aws_secret_access_key\s*[:=]\s*['"]?[A-Za-z0-9/+=]{40}
GitHub Token:         gh[pousr]_[A-Za-z0-9_]{36,251}
Private Key:          -----BEGIN (RSA|DSA|EC|OPENSSH) PRIVATE KEY-----
Generic API Key:      (?i)(api[_-]?key|apikey)\s*[:=]\s*['"]?[A-Za-z0-9]{16,}
Stripe Live Key:      sk_live_[0-9a-zA-Z]{24,}
JWT Bearer:           eyJ[A-Za-z0-9_-]*\.eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*
SendGrid:             SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}
```

### Git pre-commit hook:
```bash
#!/bin/bash
# .git/hooks/pre-commit — install: git config core.hooksPath .git/hooks

if detect-secrets scan --baseline .secrets-baseline 2>&1 | grep -q "Secrets found"; then
    echo "❌ Secrets detected! Review with: detect-secrets audit .secrets-baseline"
    exit 1
fi
```

### TruffleHog (scan git history):
```bash
# Scan entire history
trufflehog git file:///path/to/repo --json | jq 'select(.Result == "VERIFIED")'

# If secrets found — IMMEDIATE response:
# 1. Rotate all exposed credentials
# 2. Check CloudTrail/stripe dashboard/usage logs for misuse
# 3. git filter-repo to remove from history
```

---

## DEPENDENCY AUDIT

### Tool per ecosystem:
```bash
# Python
pip-audit                              # pip install pip-audit

# Node.js
npm audit --audit-level=high           # built-in
snyk test                              # snyk.io — more thorough

# Go
govulncheck ./...                      # go install golang.org/x/vuln/cmd/govulncheck@latest

# Ruby
bundle audit                            # gem install bundle-audit

# Docker
trivy image myapp:latest               # docker scout, trivy
```

### Frequency and response:
```
CI gate:  Fail build on CRITICAL/HIGH CVEs only (not medium/low — too noisy)
Weekly:   Full dependency audit in CI
On CVE:   Check https://osv.org — is your package affected?
If affected:
  1. Upgrade to fixed version immediately
  2. If no fix: isolate the component, monitor, consider removal
  3. Apply WAF rule / compensating control as temporary measure
  4. Create tracking issue, prioritize fix
```

---

## API AUTH REVIEW

### Broken Object Level Authorization (BOLA) — most common API vulnerability:
```python
# ❌ Any authenticated user can read any resource by ID
@router.get("/orders/{order_id}")
def get_order(order_id: int, token: str = Depends(get_token)):
    return db.query(Order).get(order_id)

# ✅ Check ownership
@router.get("/orders/{order_id}")
def get_order(order_id: int, user = Depends(get_current_user)):
    order = db.query(Order).get(order_id)
    if order.user_id != user.id:
        raise HTTPException(403, "Forbidden")
    return order
```

### Broken Function Level Authorization:
```python
# ❌ Regular users can access admin actions
@router.delete("/users/{user_id}")
def delete_user(user_id: int, token = Depends(get_token)):
    db.delete(User).where(User.id == user_id)

# ✅ Role check
@router.delete("/users/{user_id}")
def delete_user(user_id: int, user = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(403, "Admin access required")
    if user.id == user_id:
        raise HTTPException(400, "Cannot delete own account")
```

### CORS — never wildcards for authenticated APIs:
```python
app.add_middleware(
    CORSMMiddleware,
    allow_origins=["https://app.yourcompany.com"],  # exact origin only
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
    allow_credentials=True,
)
# ❌ Never: allow_origins=["*"] with credentials
```

### Rate limiting (always auth rate limits, not just IP):
```python
# ❌ IP-based rate limit (easy to bypass with multiple IPs)
# ✅ Authenticated rate limit (per API key or user ID)
def rate_limit_key(request: Request) -> str:
    # Use user ID or API key, not IP — users behind NAT share IPs
    return request.headers.get("Authorization", request.client.host)
```

---

## VULNERABILITY RESPONSE (CVE Disclosure)

### Severity matrix:
```
CRITICAL (CVSS 9-10): Emergency patch, deploy within 24h
HIGH     (CVSS 7-8.9): Patch within 1 week
MEDIUM   (CVSS 4-6.9): Patch within 1 month
LOW      (CVSS < 4):   Patch in next sprint

Exploitability signals that bump severity:
  - Public exploit available (POC on GitHub, Metasploit module)
  - Wormable / self-propagating
  - Requires no special privileges
  - Works against default configurations
```

### Response workflow:
```
Hour 0:     Confirm vulnerability exists (don't trust the report blindly)
            Is it in YOUR code or a dependency you actually use?
            Check: govulncheck ./... or pip-audit
Hour 1:     If confirmed: notify security team lead, open incident
Hour 2:     Assess impact: what data/system is at risk?
Hour 4:     Identify fix (upgrade? patch? remove feature?)
Hour 6:     Deploy fix to staging, validate
Hour 12:    Deploy to production (no deploy freeze unless higher priority)
Hour 24:    Public disclosure (coordinate with reporter if responsible)
```
