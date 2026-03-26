---
name: observability-check
description: >
  Use when setting up, reviewing, or debugging observability: logging, tracing,
  metrics, dashboards, SLOs, alerting, or distributed tracing.
  Triggers on: "observability", "structured logging", "distributed tracing",
  "OpenTelemetry", "Prometheus", "Grafana", "SLO", "SLA", "alerting",
  "log aggregation", "trace ID", "span", "metrics", "dashboard", "P99",
  "p99 latency", "error rate", "uptime", "on-call", "Datadog", "Honeycomb".
---

# Observability Check Skill

## Decision Tree — What Are You Doing?

```
Building a new service and need observability foundations?
  → Go to: MINIMUM VIABLE OBSERVABILITY
Debugging a production issue (live)?
  → Go to: DEBUGGING WITH TRACES
Reviewing existing observability setup?
  → Go to: HEALTH CHECK AUDIT
Setting up SLOs and alerts?
  → Go to: SLO + ALERTING PLAYBOOK
Choosing a tech stack?
  → Go to: STACK DECISION
```

---

## MINIMUM VIABLE OBSERVABILITY (new service)

### The Three Pillars — what you need minimum:

**1. Structured Logs** (not free-text)
```python
import structlog, logging

structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.JSONRenderer()  # Always JSON in production
    ]
)

log = structlog.get_logger()

# ❌ Bad — unparseable, impossible to query
log.warning("user validation failed")

# ✅ Good — every log is queryable
log.warning("user_validation_failed",
    user_id="usr_abc123",
    reason="email_domain_blocked",
    attempted_domain="tempmail.com",
    trace_id="4bf92f3577b34da6a3ce929d0e0e4736",
    service="auth-service",
    version="1.4.2"
)
```

**2. Distributed Trace Context** (not optional for microservices)
```python
# Always extract and propagate trace_id
from opentelemetry import trace
from opentelemetry.trace import propagation

def handle_request(headers, body):
    ctx = propagation.extract(headers)  # Extract from incoming headers
    tracer = trace.get_tracer(__name__)

    with tracer.start_as_current_span("process_payment", context=ctx) as span:
        span.set_attribute("payment.amount", 99.99)
        span.set_attribute("payment.currency", "USD")
        span.set_attribute("user.id", body["user_id"])

        try:
            result = payment_service.charge(body)
            span.set_status(trace.Status(trace.StatusCode.OK))
            return result
        except PaymentDeclined as e:
            span.record_exception(e)
            span.set_status(trace.Status(trace.StatusCode.ERROR, str(e)))
            raise
        # Always close the span — even on exception
```

**3. RED Metrics** (Request/Error/Duration — the three numbers that matter)
```python
from prometheus_client import Counter, Histogram, Gauge

# Per-service, expose /metrics endpoint
request_count = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status_code']
)
request_duration = Histogram(
    'http_request_duration_seconds',
    'HTTP request latency',
    ['method', 'endpoint'],
    buckets=[.005, .01, .025, .05, .1, .25, .5, 1.0, 2.5]
)
active_requests = Gauge(
    'http_requests_in_flight',
    'Requests currently being processed',
    ['service']
)

# Always record these for every request:
# 1. Count: how many requests? (error rate = errors / total)
# 2. Duration: is latency growing? (P50/P95/P99)
# 3. In-flight: is the service overloaded? (current concurrency)
```

### HTTP middleware (automatic instrumentation)
```python
# FastAPI example — auto-instrument all routes
from fastapi import FastAPI
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from prometheus_client import make_asgi_app

app = FastAPI()
FastAPIInstrumentor.instrument_app(app)  # Auto-traces all routes
app.mount("/metrics", make_asgi_app())   # Expose Prometheus metrics
```

---

## DEBUGGING WITH TRACES (production incident)

### Trace debugging workflow:
```
1. Find the slow/erring trace
   → Grafana: filter traces by error=true, duration > 1s
   → Honeycomb: `error=true` refinement
   → Datadog: APM → Traces → filter error:true

2. Identify the offending span
   → Look for: duration >> other spans in same trace
   → Look for: error=true with exception type
   → Look for: DB spans with high row count

3. Expand the slow span
   → What were the attributes?
   → What was the DB query? (check db.statement)
   → What external calls were made?

4. Correlate with logs
   → Extract trace_id from span
   → Query logs: trace_id=<id>
   → Match timestamps
```

### Key span attributes to always set:
```python
# HTTP spans
span.set_attribute("http.method", "POST")
span.set_attribute("http.url", "https://api.stripe.com/v1/charges")
span.set_attribute("http.status_code", 200)
span.set_attribute("http.response_content_length", 512)

# DB spans
span.set_attribute("db.system", "postgresql")
span.set_attribute("db.name", "orders_db")
span.set_attribute("db.statement", "SELECT * FROM orders WHERE user_id = $1")  # no PII values in statement
span.set_attribute("db.sql_table", "orders")
span.set_attribute("db.rows_affected", 1)

# Queue spans
span.set_attribute("messaging.system", "kafka")
span.set_attribute("messaging.destination", "order-created")
span.set_attribute("messaging.operation", "receive")
```

### Sampling strategy:
```
Development:     100% of traces (you want full visibility)
Production:      10% of healthy traces, 100% of errors
High-traffic:    1% of healthy + 100% of errors + tail-based sampling for slow traces
Rule: Always sample 100% of errors and traces > 5s
```

---

## HEALTH CHECK AUDIT (review existing setup)

### Questions to answer:
```
LOGGING
  [ ] Are logs JSON structured (not free-text)?
  [ ] Is every log annotated with trace_id and span_id?
  [ ] Are logs at appropriate levels (no ERROR for expected failures)?
  [ ] Is PII/sensitive data filtered before logging?
  [ ] Can you answer "how many requests failed today" in < 1 query?
  [ ] Log retention: hot (7d searchable) / warm (30d) / cold (1y)?

TRACING
  [ ] Is every service instrumented with OpenTelemetry (or equivalent)?
  [ ] Can you trace a request across all services in a single view?
  [ ] Are DB calls instrumented separately from business logic?
  [ ] Can you identify which service is causing latency?

METRICS
  [ ] Are RED metrics (Rate, Errors, Duration) exposed for every service?
  [ ] Do you have SLO dashboards (not just raw metrics)?
  [ ] Are business metrics tracked (not just infrastructure)?
  [ ] Can you answer "what % of checkout attempts succeeded" today?

ALERTING
  [ ] Do you have SLO burn rate alerts (not just symptom alerts)?
  [ ] Can on-call answer "is this affecting users?" in < 2 min?
  [ ] Is there a runbook for every alert?
  [ ] Is alert noise < 2 false positives per week?
```

---

## SLO + ALERTING PLAYBOOK

### SLO definition template:
```yaml
# Example: Order Service SLOs
service: order-service
team: commerce-platform

slos:
  - name: Checkout Availability
    target: 99.9%
    window: 30d rolling
    method: total / errors
    source: prometheus
    query: |
      1 - (
        sum(rate(http_requests_total{job="order-service",status_code=~"5.."}[5m]))
        /
        sum(rate(http_requests_total{job="order-service"}[5m]))
      )
    alert:
      - name: CheckoutAvailability_SLOBurn
        threshold: 99.5% (budget burning fast)
        window: 1h

  - name: Checkout Latency
    target: 99.0%
    window: 30d rolling
    method: good events / total events
    threshold: P99 < 2s
    source: prometheus
    query: |
      histogram_quantile(0.99,
        sum(rate(http_request_duration_seconds_bucket{job="order-service"}[5m])) by (le)
      )

# SLO budgets (how much error budget do you have?)
99.9% over 30d  → 43.8 minutes of allowed downtime
99.99% over 30d → 4.4 minutes of allowed downtime
```

### Alert severity levels:
```
P1 (SEV-1) — Immediate, user-facing outage
  → Page on-call immediately
  → Example: error rate > 5% OR checkout success rate < 90%
  → Target response: < 15 minutes

P2 (SEV-2) — Degraded service, significant impact
  → Page on-call within 30 min
  → Example: P99 latency > 10s OR error rate > 1%
  → Target response: < 1 hour

P3 (SEV-3) — Non-critical issue
  → Notify in #alerts channel, business hours
  → Example: disk usage > 80% OR certificate expiring in < 7 days

P4 (SEV-4) — Informational
  → Log only, review in weekly
  → Example: elevated error rate but within SLO
```

### Runbook template (per alert):
```markdown
# Alert: HighErrorRate_PaymentService

## Symptom
Error rate on /payments/* endpoints > 2% for 5+ minutes

## Impact
- Users cannot complete checkout
- Estimated affected users: ~10% of checkout attempts

## Diagnosis
1. Check payment provider status (Stripe Dashboard → Incidents)
2. Check DB: are order-service DB connections exhausted?
   ```sql
   SELECT count(*) FROM pg_stat_activity WHERE datname = 'orders';
   ```
3. Check for recent deploys: did this start immediately after a deploy?
4. Check trace view: which specific endpoint is failing?

## Mitigation
1. If provider issue: check https://status.stripe.com — if YES, escalate to provider incident
2. If deploy-related: roll back last deploy (see ROLLBACK_PLAYBOOK)
3. If DB issue: scale connection pool, check for long-running queries

## Escalation
If not resolved in 30 min → page team lead
If data corruption suspected → page DBA on-call
```

---

## STACK DECISION

```
LOGGING AGGREGATION
  Self-hosted:   Loki + Grafana (cheapest, Kubernetes-native)
  Cloud-managed: Datadog Logs, CloudWatch Logs, GCS + BigQuery

TRACE
  Self-hosted:   Tempo (Grafana stack) or Jaeger
  Cloud-managed: Datadog APM, AWS X-Ray, Honeycomb

METRICS
  Self-hosted:   Prometheus + Thanos (long-term) or Mimir
  Cloud-managed: Datadog, CloudWatch, GCP Monitoring

DASHBOARD
  Grafana (most popular, works with everything above)
  Datadog (if using Datadog APM + Logs — tight integration)

CORRELATION (logs + traces + metrics in one place)
  Grafana + Tempo + Loki + Mimir = full open-source stack
  Datadog = full managed stack (higher cost, less ops)

RECOMMENDATION for most teams:
  → Grafana OSS stack (Tempo/Loki/Prometheus) for cost control
  → Datadog if you need turnkey + enterprise support (worth the cost for >20 services)
  → OpenTelemetry as the instrumentation layer regardless of backend
```
