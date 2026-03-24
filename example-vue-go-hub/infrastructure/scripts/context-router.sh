# context-router.sh (GA Orchestrator Spec)

## Logic: Spatial Neighborhood Loading

1. **Map Detection:** If active file is in `/src/auth`, load `neighborhood/auth.md`.
2. **Boundary Enforcement:** Force-inject the `CONTEXT_BOUNDARY` header into the system prompt.
3. **Instruction Scoping:** Drop Tier 2 documentation if context window total tokens > 60% of limit.

## Logic: Pre-existing Flake Detection
`./infrastructure/scripts/baseline-check.sh`
- Run before Turn 1 of Editor Pass.
- Output: YAML list of failing test names to be ignored by agent logic analysis.
