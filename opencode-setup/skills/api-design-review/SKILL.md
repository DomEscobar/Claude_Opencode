---
name: api-design-review
description: >
  Use when designing, reviewing, or auditing REST/GraphQL APIs.
  Triggers on: "design an API", "API review", "REST endpoint", "GraphQL schema",
  "API versioning", "API pagination", "rate limiting", "API error format",
  "OpenAPI spec", "API design", "endpoint naming", "HTTP status codes",
  "request validation", "API security", "webhook design".
---

# API Design Review Skill

## Decision Tree — What Are You Doing?

```
Designing a new API or endpoint?
  → Go to: DESIGN CHECKLIST
Reviewing an existing API?
  → Go to: REVIEW CHECKLIST
Writing an OpenAPI spec or validating one?
  → Go to: OPENAPI GUIDANCE
Handling errors consistently?
  → Go to: ERROR RESPONSE STANDARD
Dealing with versioning?
  → Go to: VERSIONING STRATEGY
Designing pagination?
  → Go to: PAGINATION PATTERNS
Setting up rate limiting?
  → Go to: RATE LIMITING PATTERNS
```

---

## DESIGN CHECKLIST

### URL & Resource Naming
```
✅ /users                 → list users (GET)
✅ /users/{id}            → single user (GET, PUT, DELETE)
✅ /users/{id}/orders     → user's orders (nested resource)
✅ /orders/{id}/cancel    → action on resource (POST — idempotent-ish)
❌ /getUser               → never verbs in URLs
❌ /userData              → no mixed casing, be consistent
❌ /v1/users              → version in path, NOT query param

Use plural nouns for collections: users, orders, events
Use kebab-case for multi-word: line-items, user-profiles
Keep depth ≤ 2 levels: /users/{id}/orders/{orderId} is OK
                         /users/{id}/orders/{orderId}/line-items/{lineItemId} is too deep
                         → flatten: /line-items/{id}
```

### HTTP Method Matrix
```
GET    /users         → list (200), list empty (200 []), filter (200)
GET    /users/{id}    → found (200), not found (404)
POST   /users         → created (201 + Location header), validation fail (422)
PUT    /users/{id}    → updated (200), not found (404), no change (200)
PATCH  /users/{id}    → partial update (200), not found (404)
DELETE /users/{id}    → deleted (204 no body), not found (404)

POST should be idempotent-safe or require idempotency key for:
  - Payment processing
  - Subscription creation
  - Any mutation that costs money
```

### Request Validation Rules
```python
# Always validate BEFORE hitting the database
# Use schema validation library (Pydantic, Zod, Joi, marshmallow)

# Example: Pydantic (Python)
class CreateUserRequest(BaseModel):
    email: EmailStr                    # Validated email format
    name: str = Field(..., min_length=1, max_length=100)
    age: int = Field(..., ge=0, le=150) # Non-negative, reasonable bound
    role: Literal["admin", "member"]    # Enum, not free-form string
    metadata: dict | None = None       # Sanitize before storing

    @field_validator("email")
    @classmethod
    def lowercase_email(cls, v):
        return v.lower()

    @field_validator("metadata")
    @classmethod
    def no_sensitive_fields(cls, v):
        BLOCKED = {"password", "token", "secret", "ssn"}
        if BLOCKED & set(str(k).lower() for k in v.keys()):
            raise ValueError("metadata cannot contain sensitive fields")
        return v
```

### Response Envelope Standard
```json
// Success — single resource
{
  "data": {
    "id": "usr_abc123",
    "email": "alice@example.com",
    "name": "Alice",
    "createdAt": "2024-03-01T12:00:00Z"
  }
}

// Success — collection (include pagination)
{
  "data": [
    { "id": "usr_abc123", "email": "alice@example.com", "name": "Alice" }
  ],
  "pagination": {
    "cursor": "eyJpZCI6InVzcl9hYmMxMjMifQ==",
    "hasMore": true,
    "total": 842
  },
  "meta": {
    "requestId": "req_xyz789",
    "timestamp": "2024-03-01T12:00:00Z"
  }
}

// Error — always consistent shape
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      { "field": "email", "message": "Invalid email format" },
      { "field": "age", "message": "Must be between 0 and 150" }
    ],
    "requestId": "req_xyz789",
    "documentationUrl": "https://api.example.com/errors/VALIDATION_ERROR"
  }
}
```

---

## ERROR RESPONSE STANDARD

### HTTP Status Code Map
```
200 OK              → successful read/update
201 Created         → resource created (include Location header)
204 No Content      → successful delete
400 Bad Request     → client malformed the request
401 Unauthorized    → not authenticated (no/invalid credentials)
403 Forbidden       → authenticated but not authorized
404 Not Found       → resource doesn't exist
409 Conflict        → state conflict (duplicate, version mismatch)
410 Gone            → resource permanently deleted
422 Unprocessable   → validation failed (semantically invalid)
429 Too Many Reqs   → rate limited
500 Internal Error  → server fault (NEVER leak internal details)
503 Unavailable     → service down, degraded, or maintenance
504 Gateway Timeout → upstream timeout
```

### Error Code Registry (maintain a shared list)
```
AUTHENTICATION_REQUIRED    → 401, missing credentials
INVALID_TOKEN              → 401, expired or malformed JWT
FORBIDDEN                  → 403, valid creds but insufficient permission
RESOURCE_NOT_FOUND         → 404, {resourceType}/{id}
DUPLICATE_RESOURCE         → 409, unique constraint violated
VALIDATION_ERROR           → 422, field-level validation failed
RATE_LIMIT_EXCEEDED        → 429, include Retry-After header
INTERNAL_ERROR             → 500, log details, return generic message
SERVICE_UNAVAILABLE        → 503, include Retry-After header
```

---

## VERSIONING STRATEGY

### Rule: URL versioning for REST (most explicit)
```
https://api.example.com/v1/users
https://api.example.com/v2/users          ← breaking changes only
https://api.example.com/v1/users?format=compact  ← non-breaking can be query flags
```

### Coexistence timeline (never cut off v1 instantly):
```
Day 0:   v1 and v2 both available. v1 docs marked "deprecated".
Day 30:  v1 returns Deprecation header: Warning: 299 - "v1 deprecated, migrate to v2"
Day 90:  v1 returns 410 Gone with migration instructions
```

### Header versioning (for strict RFC 9001 compliance):
```
GET /users
Accept: application/vnd.example.v2+json
API-Version: 2024-03-01     ← if using date-based versioning
```

### Breaking vs Non-Breaking Change Matrix
```
BREAKING (require new version):
  - Removing a field from response
  - Changing a field's type
  - Changing URL structure
  - Removing an endpoint
  - Changing required vs optional parameters
  - Changing authentication requirements

NON-BREAKING (no version bump needed):
  - Adding new optional fields to request
  - Adding new fields to response
  - Adding new endpoints
  - Adding new optional query parameters
  - Adding new pagination parameters
```

---

## PAGINATION PATTERNS

### Cursor-based (best for large/stable datasets)
```json
{
  "data": [...],
  "pagination": {
    "cursor": "eyJpZCI6MTIzNH0=",
    "hasMore": true
  }
}

// Next page request:
GET /orders?after=eyJpZCI6MTIzNH0=&limit=50

// Server:
WHERE id > 1234 ORDER BY id LIMIT 50
```

### Offset-based (OK for small/admin lists)
```
GET /users?offset=100&limit=25
// Problem: inconsistent on inserts/deletes; slow on large offsets
```

### Keyset pagination (cursor alternative for sorted by non-unique fields)
```sql
WHERE created_at < :cursor_value AND id < :cursor_id
ORDER BY created_at DESC, id DESC
LIMIT 20
```

---

## RATE LIMITING PATTERNS

### Response headers (always include):
```
X-RateLimit-Limit: 1000        ← requests allowed per window
X-RateLimit-Remaining: 847      ← requests left in current window
X-RateLimit-Reset: 1709301600   ← Unix timestamp when window resets
Retry-After: 3600               ← seconds to wait (only on 429)
```

### Implementation pattern (token bucket per API key):
```
Every request: check Redis
  key = ratelimit:{api_key}:{window}
  INCR key
  EXPIRE key {window_seconds}
  if count > limit: return 429 with Retry-After
```

### Tiered limits example:
```
Free tier:   100 req/min,  1,000 req/day
Pro tier:    1,000 req/min, 100,000 req/day  
Enterprise:  custom SLA — no rate limits, just SLA uptime
```

---

## OPENAPI GUIDANCE

### Must-have fields per endpoint:
```yaml
/users/{id}:
  get:
    operationId: getUser
    summary: Get a user by ID
    tags: [Users]
    parameters:
      - name: id
        in: path
        required: true
        schema: { type: string }
        description: User ID (format: usr_xxxxxxxx)
    responses:
      "200":
        description: User found
        content:
          application/json:
            schema: { $ref: "#/components/schemas/User" }
      "404":
        $ref: "#/components/responses/NotFound"
      "429":
        $ref: "#/components/responses/RateLimited"
    security: [{ ApiKeyAuth: [] }]
```

### Required schema components (define once, reuse):
```yaml
components:
  schemas:
    User:
      type: object
      required: [id, email]
      properties:
        id:       { type: string, example: "usr_abc123", readOnly: true }
        email:    { type: string, format: email, example: "alice@example.com" }
        name:     { type: string, example: "Alice" }
        createdAt:{ type: string, format: date-time, readOnly: true }
    Error:
      $ref: "#/components/schemas/ErrorResponse"
  responses:
    NotFound:
      description: Resource not found
      content:
        application/json:
          schema: { $ref: "#/components/schemas/ErrorResponse" }
    RateLimited:
      description: Rate limit exceeded
      headers:
        Retry-After:
          schema: { type: integer }
```

---

## REVIEW CHECKLIST (existing API audit)

- [ ] All endpoints have operationId
- [ ] All error codes mapped to HTTP status codes
- [ ] Authentication method specified (Bearer token? API key? Both?)
- [ ] Pagination implemented for all list endpoints
- [ ] Rate limit headers present
- [ ] Sensitive data never logged (passwords, tokens, PII in query params)
- [ ] All timestamps in ISO 8601 / RFC 3339
- [ ] IDs are opaque tokens (not sequential integers exposed externally)
- [ ] POST/PUT/PATCH requests validate input before processing
- [ ] DELETE is idempotent (calling twice returns 204 then 404, not 500)
- [ ] OpenAPI spec validates with `swagger-cli validate` or `redocly lint`
