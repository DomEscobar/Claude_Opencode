---
name: incident-response
description: >
  Use when responding to a production incident, writing postmortems, or
  planning on-call rotations.
  Triggers on: "incident", "on-call", "postmortem", " outage", "blameless",
  "runbook", "war room", "SEV-1", "SEV-2", "escalate", "pagerduty", "alert fired",
  "production down", "service degraded", "p1", "p2", "sev1", "runbook",
  "RCA", "root cause", "incident commander".
---

# Incident Response Skill

## Decision Tree — What's Happening?

```
It's 3am, your phone is ringing
  → Go to: IMMEDIATE RESPONSE
Incident is over, writing postmortem
  → Go to: POSTMORTEM GUIDE
Building/updating runbooks
  → Go to: RUNBOOK_TEMPLATE
Planning on-call rotation
  → Go to: ONCALL_ROTATION
```

---

## IMMEDIATE RESPONSE (first 5 minutes)

### Step 1: Acknowledge & Assess
```
1. Acknowledge the alert (PagerDuty/OpsGenie/etc.) — this stops escalations
2. Join the incident channel: #incidents in Slack (create if not exists)
3. Post: "I'm investigating [brief description]. ETA for update: 5 min"
4. Assess severity (don't over-escalate, don't under-escalate):

P1 (SEV-1): User-facing outage, > 5% error rate, service down
  → Declare incident immediately
  → Assign Incident Commander (IC)
  → Open war room (video call)
  → Update status page

P2 (SEV-2): Significant degradation, some users affected
  → Investigate, post update
  → Involve relevant team lead
  → Consider declaring if > 30 min

P3/P4: Non-urgent, working-hours issue
  → Assign to sprint, don't page
```

### Step 2: Diagnose (use traces first, logs second)
```
First 2 minutes — check these in order:
1. Is it just you or is the service actually down?
   → curl -k https://api.yourservice.com/healthz
   → Check: is it YOUR service or an upstream?

2. What's the error pattern? (check in this order)
   a. Metrics: Error rate spike? Latency spike? Both?
      → Grafana: Error rate dashboard
      → If error rate UP + latency DOWN → likely a crash/error bug
      → If error rate UP + latency UP → likely resource exhaustion
      → If both UP → check DB and downstream services

   b. Distributed traces: which span is failing?
      → Find a failing trace, expand it, identify the slow/error span

   c. Logs: what's the error message?
      → Query: trace_id=<from failing trace>
      → Look for: exceptions, connection timeouts, OOM kills

3. Is it a deployment issue?
   → Did anything deploy in the last 30 min? (check Argo CD / K8s rollout)
   → kubectl rollout history deployment/order-service
   → kubectl rollout undo deployment/order-service  # if deploy is culprit

4. Is it a downstream dependency?
   → Check your deps' status pages first (Stripe, AWS, Twilio, etc.)
   → Then check your own DB/cache/queue health
```

### Step 3: Mitigate (resolve first, fix second)
```
MITIGATION BEFORE ROOT CAUSE — users are impacted NOW

If deploy-related:
  → Rollback immediately: kubectl rollout undo deployment/your-service
  → Deploy fix to staging first, test, then redeploy

If DB-related (connection exhaustion):
  → Increase connection pool size (temporary)
  → Kill long-running queries:
    SELECT pid, now() - query_start AS duration, query
    FROM pg_stat_activity
    WHERE state != 'idle' AND query_start < now() - interval '5 minutes'
    ORDER BY duration DESC;

If dependency is down (external API):
  → Enable circuit breaker if not already (see patterns below)
  → Fall back to cached data or degraded mode
  → Continue serving stale data if acceptable (feature flag)

If resource exhaustion (OOM, CPU):
  → Scale up horizontally (kubectl scale deployment/your-service --replicas=5)
  → This is temporary — find root cause after

NEVER: try to "fix" code and deploy during an active outage
      → Rollback → Verify stable → Investigate → Fix → Deploy
```

### Step 4: Communicate (every 15 minutes, even if no update)
```
Status page: update every 10-15 min if SEV-1
Incident channel: post updates every 15 min
Internal: notify engineering leads

Update format:
"Update [time]: [What we know]. [What we're doing]. [Next update at X:XX]"

Example:
"Update 14:32: Confirmed checkout service errors caused by a DB connection pool
exhaustion after a deploy 30 min ago. Rolling back deploy now. Next update 14:45."
```

### Circuit Breaker Pattern (reference):
```python
# Without circuit breaker: a single slow dependency kills your service
# With circuit breaker: open circuit after N failures, fail fast

from circuitbreaker import circuit

@circuit(failure_threshold=5, recovery_timeout=30, expected_exception=PaymentError)
def charge_payment(amount: int, token: str) -> PaymentResult:
    return stripe.charges.create(amount=amount, source=token)
    # After 5 failures in 30s, circuit opens
    # Next call fails immediately with CircuitOpenError (no network call)
    # After 30s, circuit half-opens: allows one test call
    # If success: circuit closes. If failure: circuit reopens.
```

---

## POSTMORTEM GUIDE

### When: always for SEV-1, always for SEV-2 > 1hr, consider for SEV-2

### Blameless principle:
```
The goal is to understand the system, not to find who to blame.
Multiple factors contributed to every incident.
Focus on: what made it easy to have, hard to detect, hard to mitigate?

"Good" postmortem: "The deployment pipeline did not catch the missing index because
our schema review checklist had a gap" — systemic issue.
"Bad" postmortem: "Alice deployed without checking the migration" — blame.
```

### Postmortem template:
```markdown
# Postmortem: [Incident Name]
Date: 2024-03-01
Duration: 47 minutes (14:05 - 14:52 UTC)
Severity: SEV-1
Status: RESOLVED
Author: [Name]
Reviewers: [Team leads]

## Summary
Brief (3 sentences max): what happened, what was the impact, how was it resolved.

## Impact
- Users affected: ~12% of checkout attempts (est. 340 users)
- Revenue impact: ~$2,400 in failed transactions
- Duration: 47 minutes

## Timeline (UTC)
- 13:42 — Deploy #1234 pushed to production (order-service v2.3.1)
- 13:55 — First error alerts fire (checkout error rate 3%)
- 14:05 — On-call acknowledges, declares SEV-1
- 14:08 — Incident channel opened, war room started
- 14:12 — Rollback initiated
- 14:18 — Rollback complete, error rate returning to baseline
- 14:52 — Error rate fully normalized, incident closed

## Root Cause
The migration in deploy #1234 added a NOT NULL column without a default value
to the `orders` table. Existing rows had NULL values. PostgreSQL rewrites the
entire table when adding a NOT NULL column without a default — this locked the
orders table for ~90 seconds, causing all checkout requests to timeout.

Contributing factors:
1. Staging DB had only 1,000 orders vs production's 8M — lock was negligible in staging
2. Migration review checklist did not include "estimate lock duration for large tables"
3. No table lock monitoring was in place

## What Went Well
- Alerting detected the issue within 13 minutes
- Rollback was executed cleanly in 6 minutes
- Communication was timely and accurate

## What Went Poorly
- Staging data volume was not representative of production
- Migration review process had a gap in lock duration estimation

## Action Items
| Action | Owner | Due |
|--------|-------|-----|
| Add lock duration estimation to migration checklist | @alice | 2024-03-08 |
| Implement pg_skb for large table lock monitoring in staging | @bob | 2024-03-15 |
| Add migration safety gate: block migrations on tables > 1M rows without DBA sign-off | @alice | 2024-03-08 |
| Add pre-deploy smoke test with production-sized dataset | @dave | 2024-03-22 |
```

### Postmortem quality checklist:
- [ ] Timeline is accurate (check actual timestamps from logs/traces)
- [ ] Root cause is specific and systemic (not "human error")
- [ ] All contributing factors listed
- [ ] At least 3 action items (if 0 — the fix was too shallow)
- [ ] Action items have owners and due dates
- [ ] Action items are tracked in Jira/GitHub Issues (not just in doc)

---

## RUNBOOK_TEMPLATE

```markdown
# Runbook: [Service] — [Specific Scenario]

## Symptoms
What does this alert look like when it fires? What are the user-visible symptoms?

## Diagnosis
Step-by-step commands to diagnose:
```bash
# Step 1: Check if service is running
kubectl get pods -n production -l app=order-service

# Step 2: Check recent events
kubectl describe pod order-service-xxx -n production | tail -50

# Step 3: Check logs for the relevant timeframe
kubectl logs -n production order-service-xxx --since=30m | grep -i error

# Step 4: Check resource usage
kubectl top pod order-service-xxx -n production
```

## Resolution
Step-by-step to resolve this specific issue:
```bash
# If X: do this
kubectl rollout undo deployment/order-service -n production

# If Y: do this
kubectl exec -it order-service-xxx -n production -- python manage.py backfill_orders
```

## Escalation
When to escalate to team lead / on-call senior / DBA:
→ If resolution steps don't work in 15 minutes
→ If DB corruption suspected
→ If data loss suspected

## Related
- Link to related runbooks
- Link to relevant dashboard
- Link to related service's runbook
```

---

## ONCALL_ROTATION

### Best practices:
```
Rotation: weekly (min), daily for high-traffic services
Never on-call alone two weeks in a row (prevents burnout)
Shadow week: new on-callers shadow experienced on-callers for 1 week before going solo
Handoff: 30-min overlap meeting every Friday to discuss active issues

Primary + Secondary (not just primary):
  Primary doesn't answer in 5 min → escalate to Secondary
  Secondary doesn't answer in 10 min → page entire team
  Sev-1 after 15 min without response → page entire team + engineering lead

On-call schedule tool: PagerDuty, OpsGenie, Squadcast
 → Always use a rotation schedule, never ad-hoc assignments
 → Test escalation paths quarterly
```

### On-call compensation:
```
Minimum: provide on-call pay (even for small teams)
On-call should not be a tax on being good at your job
If on-call is > 1 per week on average → team is understaffed
Track MTTD (Mean Time To Detect) and MTTR (Mean Time To Resolve) per incident
```
