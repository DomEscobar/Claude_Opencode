# Context Router (Spec)

How an agent should load context based on the active file.

## Context Loading

1. Identify which directory the active file is in.
2. Look up that directory in `REGIONAL_MAP.md` to find the scoped `AGENTS.md`.
3. Load the scoped `AGENTS.md` for local rules and conventions.
4. If the context window is running low, prioritize the scoped `AGENTS.md` over the root-level one.

## Pre-existing Failure Detection

Before making changes, run the relevant test suite and record any failures.
These pre-existing failures should not be counted against your patch.
