# Agentic KPIs & Responsibilities (v3.0 GA Force)

## 1. Success Metrics (Standardized)

| Metric | Target | Verification |
| :--- | :--- | :--- |
| **Differential Correctness** | 100% | New tests pass AND old tests remain stable via **Pre-Patch Baseline**. |
| **Zero-Guessing Rate** | 100% | No usage of `as any` or speculative types for missing context. |
| **Salvage Score** | >80% | Quarantined PRs must include an "Actionable Diff" for human completion. |

## 2. Differential Verification Gate
You must execute the following cycle for non-trivial logic changes:
1. **BASELINE:** Run `go test ./...` or `pnpm test`. Record failures.
2. **PATCH:** Apply content-addressed Search/Replace blocks.
3. **VERIFY:** Run tests again. 
   - New Failure = **Category B (Logic Error)**. Fix it.
   - Failure matches Baseline = **Category C (Pre-existing Flake)**. Document and Proceed.

## 3. High-Signal Quarantine (Salvage Manifest)
If a task reaches an impasse, do not simply delete or revert. **Quarantine** to a branch and write a `SALVAGE_MANIFEST.md`:
- **The Blocker:** Specific error trace or missing spec.
- **The Success:** Parts of the logic that passed shadow tests.
- **The Handoff:** "Human task: add specific auth token logic to line 45."
