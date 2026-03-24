# Agentic KPIs & Responsibilities (Hardened v2.1)

This version replaces "vibe-metrics" with deterministic engineering accountability.

---

## 1. Accountability Metrics

| Metric | Target | Verification Method |
| :--- | :--- | :--- |
| **Correctness Rate** | >95% | Passing CI + successful manual PR review. |
| **Clarification Rate** | 15-25% | Ratio of turns where the agent asks for missing specs. |
| **Surgical Reliability** | 100% | Verified by `git diff --stat` against whitelisted paths. |
| **Cleanup Rate** | 100% | Zero `__shadow_*` files remaining in the PR branch. |

---

## 2. The Hardened Shadow Test Protocol

To prevent workspace pollution, all autonomous tests must follow this 4-layer safety protocol:

### Layer 1: Unique Identification
All shadow files must use the format: `__shadow_{timestamp}_{random}_test.go` or `.spec.ts`.

### Layer 2: Build Tagging (Isolation)
Every Go shadow test MUST include the following line at the absolute top:
`//go:build shadow_test`
*This prevents shadow tests from compiling during standard production builds.*

### Layer 3: Bounded Retries
If a shadow test fails, the agent has **exactly 2 attempts** to fix the internal logic. If it still fails, the agent MUST:
1. Revert the code change.
2. Delete the shadow test.
3. Report the failure to the user.

### Layer 4: Automatic Decommissioning
Shadow tests are added to `.gitignore`. The pre-commit hook rejects any commit containing a `__shadow_*` prefix.
