---
name: test-strategy
description: >
  Use when planning, writing, or auditing test suites for any project.
  Triggers on: "testing strategy", "write tests", "unit test", "integration test",
  "end-to-end test", "E2E", "test coverage", "TDD", "BDD", "mocking", "fixtures",
  "pytest", "Jest", "Playwright", "Cypress", "test pyramid", "chaos testing",
  "contract testing", "smoke test", "regression test", "load test", "performance test".
---

# Test Strategy Skill

## Decision Tree — What Are You Doing?

```
Writing new code (TDD approach)?
  → RED: write failing test first → GREEN: make it pass → REFACTOR
Writing tests for existing code?
  → Go to: TEST PRIORITY MATRIX
Auditing existing test quality?
  → Go to: TEST HEALTH CHECK
Setting up CI test pipeline?
  → Go to: PIPELINE GUIDANCE
Debugging flaky tests?
  → Go to: FLAKY TEST PLAYBOOK
Adding load/chaos tests?
  → Go to: NON-FUNCTIONAL TESTING
```

---

## TEST PRIORITY MATRIX

### The Matrix (what to test, in what order)
```
HIGH VALUE + LOW EFFORT  → Do immediately
  ✅ Unit tests for business logic (pure functions, validators, transformers)
  ✅ Unit tests for error/edge case handlers
  ✅ Integration tests for DB queries (read/write)
  ✅ API endpoint smoke tests

HIGH VALUE + HIGH EFFORT → Do for critical paths
  ✅ E2E tests for checkout/payment flows
  ✅ Contract tests for external API integrations
  ✅ Load tests for API endpoints under SLA

LOW VALUE + LOW EFFORT  → Do if time permits
  ✅ Unit tests for utility helpers
  ✅ Simple smoke tests

LOW VALUE + HIGH EFFORT → Skip or automate away
  ❌ Snapshot tests for UI (flaky, low signal)
  ❌ 100% code coverage mandate (produces busywork, not quality)
  ❌ Testing third-party library internals
```

---

## UNIT TEST STANDARDS

### Naming convention
```
method: getUserByEmail(email: string) → User | null
test:  getUserByEmail_returnsUser_whenEmailExists
test:  getUserByEmail_returnsNull_whenEmailNotFound
test:  getUserByEmail_throwsValidationError_whenEmailMalformed

method: calculateDiscount(items: CartItem[], coupon: Coupon) → Money
test:  calculateDiscount_appliesPercent_offForValidCoupon
test:  calculateDiscount_doesNotStack_couponAlreadyApplied
test:  calculateDiscount_ignoresExpiredCoupon
test:  calculateDiscount_throws_whenCartEmpty
```

### Arrange-Act-Assert (AAA) — always
```python
# ❌ Bad — sprawls across file
def test_discount():
    items = [...]
    coupon = Coupon(...)
    result = calculate_discount(items, coupon)
    assert result.amount == 15.00

# ✅ Good — explicit AAA
def test_calculateDiscount_returns15PercentOff_forValidCoupon():
    # Arrange
    cart = CartItem(sku="WIDGET", quantity=2, unit_price=Money(50.00, "USD"))
    coupon = Coupon(code="SAVE15", discount_pct=15, expires_at=datetime(2030,1,1))

    # Act
    discount = calculate_discount([cart], coupon)

    # Assert
    assert discount.amount == Money(15.00, "USD")
    assert discount.type == DiscountType.PERCENTAGE
    assert discount.applied_to == cart.sku
```

### Mocking rules (don't mock what you own)
```
✅ MOCK: external HTTP calls, database, file system, cache, queue
❌ DON'T MOCK: your own domain classes, pure business logic, internal services
```

```python
# ✅ Correct mocking
class TestOrderService:
    @patch("app.services.order_service.EmailClient")  # Mock external dependency
    @patch("app.services.order_service.OrderRepository")  # Mock DB layer
    def test_sendConfirmation_sendsEmail_afterOrderCreated(self, mock_repo, mock_email):
        mock_repo.get.return_value = Order(id="ord_123", status=OrderStatus.PAID)
        mock_email.send.return_value = True

        result = OrderService().send_confirmation("ord_123")

        assert result is True
        mock_email.send.assert_called_once()
        mock_email.send.assert_called_with(
            to="customer@example.com",
            subject="Order Confirmed: ord_123",
            template="order_confirmation"
        )
```

---

## INTEGRATION TEST STANDARDS

### Database tests — use transactions for isolation
```python
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

@pytest.fixture
def db_session():
    engine = create_engine("postgresql://test:test@localhost/test_db")
    connection = engine.connect()
    transaction = connection.begin()
    Session = sessionmaker(bind=connection)
    session = Session()

    yield session  # tests run here

    session.close()
    transaction.rollback()  # ← always rollback, never commit in tests
    connection.close()
```

### API integration tests — real HTTP, test server
```python
# FastAPI example
from fastapi.testclient import TestClient

@pytest.fixture
def client():
    from app.main import app
    return TestClient(app)  # Uses app's dependency overrides

def test_createUser_returns201_andUserObject(client):
    response = client.post("/users", json={"email": "alice@example.com", "name": "Alice"})

    assert response.status_code == 201
    assert response.json()["email"] == "alice@example.com"
    assert "password" not in response.json()  # Never leak hashed passwords

def test_createUser_returns422_whenEmailInvalid(client):
    response = client.post("/users", json={"email": "not-an-email", "name": "Bob"})

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "VALIDATION_ERROR"
```

---

## E2E TEST STANDARDS (Playwright)

### Naming and structure
```typescript
// tests/e2e/checkout-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('login-btn').click();
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('complete checkout flow', async ({ page }) => {
    // Add item
    await page.getByTestId('product-widgets').click();
    await page.getByTestId('add-to-cart').click();
    await expect(page.getByTestId('cart-count')).toHaveText('1');

    // Checkout
    await page.getByTestId('cart-btn').click();
    await page.getByRole('button', { name: 'Proceed to Checkout' }).click();

    // Payment
    await page.getByLabel('Card Number').fill('4242424242424242');
    await page.getByLabel('Expiry').fill('12/26');
    await page.getByLabel('CVC').fill('123');
    await page.getByRole('button', { name: 'Pay $50.00' }).click();

    // Confirmation
    await expect(page.getByTestId('order-confirmed')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('order-number')).toMatchText(/^ORD-\d{8}$/);
  });
});
```

### E2E data setup — never depend on production-like fixtures
```typescript
// Use API to set up test state instead of DB directly
test.beforeEach(async ({ request }) => {
  const user = await request.post('/test/setup/user', {
    data: { email: `test-${Date.now()}@example.com`, plan: 'pro' }
  });
  testData.userId = user.json().id;
});
```

---

## CONTRACT TESTING (Pact / OpenAPI)

### Consumer-driven contract (example with Pact)
```typescript
// consumer.spec.ts
import { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const { like, regex } = MatchersV3;

const provider = new PactV3({
  consumer: 'web-frontend',
  provider: 'user-service',
  cors: true,
});

describe('GET /users/{id}', () => {
  it('returns user details', async () => {
    await provider.addInteraction({
      states: [{ description: 'user usr_123 exists' }],
      uponReceiving: 'a request for user details',
      withRequest: {
        method: 'GET',
        path: '/users/usr_123',
        headers: { Accept: 'application/json' },
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          id: regex({ generate: 'usr_abc123', pattern: '^usr_[a-z0-9]+$' }),
          email: like('alice@example.com'),
          name: like('Alice'),
          createdAt: like('2024-03-01T12:00:00Z'),
        },
      },
    });

    await provider.executeTest(async (mockServer) => {
      const response = await fetch(`${mockServer.url}/users/usr_123`);
      expect(response.status).toBe(200);
    });
  });
});
```

---

## NON-FUNCTIONAL TESTING

### Load test (k6 example)
```javascript
// k6-checkout.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up
    { duration: '5m', target: 100 },  // Steady state
    { duration: '2m', target: 200 },  // Stress
    { duration: '5m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],      // 95% of requests < 500ms
    http_req_failed: ['rate<0.01'],       // Error rate < 1%
    check_failure_rate: ['rate<0.01'],   // Business logic checks < 1% fail
  },
};

export default function () {
  const res = http.post(`${__ENV.BASE_URL}/checkout`, JSON.stringify({
    items: [{ sku: 'WIDGET', quantity: 1 }],
    paymentToken: 'tok_test_visa',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'status is 200 or 201': (r) => [200, 201].includes(r.status),
    'response has orderId': (r) => r.json('order.id') !== undefined,
    'response time < 2s': (r) => r.timings.duration < 2000,
  });

  sleep(Math.random() * 3 + 1);  // Think time
}
```

### Chaos testing (LitmusChaos for K8s)
```yaml
# chaos-experiments/pod-kill.yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: order-service-pod-kill
spec:
  appinfo:
    appns: production
    applabel: app=order-service
  chaosServiceAccount: litmus-admin
  experiments:
    - name: pod-kill
      spec:
        components:
          env:
            - name: TOTAL_CHAOS_DURATION
              value: '30'
            - name: CHAOS_INTERVAL
              value: '10'
            - name: FORCE
              value: 'false'
```

---

## FLAKY TEST PLAYBOOK

### Diagnosis tree:
```
Flaky test detected (CI red on rerun, green locally)
  ↓
Is it timing-related?
  → Add explicit waits (page.waitForSelector with timeout)
  → Replace sleep() with condition waits
  → Increase test timeout in CI (CI often slower)
  ↓
Is it data-dependent?
  → Use unique test data (timestamp + UUID suffix)
  → Clean up test data in beforeEach/afterEach
  → Never share test accounts between parallel tests
  ↓
Is it network-related?
  → Use retries with exponential backoff (not infinite)
  → Mock at network boundary, not in-app
  ↓
Is it test isolation failure?
  → Run tests in isolation (--parallel=false in CI for that suite)
  → Check shared global state (singleton DB connections, caches)
```

### Quarantine pattern (not ideal, but practical):
```typescript
// Skip known flaky test with tracking ticket
test('payment confirmation email', { tag: ['@flaky'] }, async ({ page }) => {
  // TODO: Fix race condition in email sending (tracked in JIRA-1234)
});
// Run with: npx playwright test --grep '@flaky' to selectively run quarantined tests
```

---

## PIPELINE GUIDANCE

### Test execution order in CI (fail fast):
```
1. Lint + type check   (fastest, catches style/naming issues)      ~1 min
2. Unit tests          (fast, no external deps)                     ~2-5 min
3. Integration tests   (DB, Redis, real services)                   ~5-10 min
4. Contract tests      (verify API compatibility)                   ~2 min
5. E2E tests           (slowest, most realistic)                    ~10-20 min
6. Load/chaos tests    (optional, nightly or pre-release)           ~20 min
```

### Branch protection rules:
```
main branch:
  ✅ All unit + integration tests must pass (no skips)
  ✅ Code coverage must not decrease by > 5%
  ✅ No new @flaky or @skip decorators without ticket
  ✅ E2E can be optional (run in parallel, don't block merge)

Feature branch:
  ✅ Lint + unit tests must pass
  ⏭️  Integration + E2E run async, don't block PR
```

### Coverage guardrails (use judiciously):
```
Good:
  ✅ Coverage must remain above 80% (prevent regressions, not micromanage)
  ✅ Critical paths must have 100% coverage (checkout, auth, payment)

Bad:
  ❌ 100% coverage mandate — teams game the metric
  ❌ Line coverage without branch coverage — missing edge cases
```
