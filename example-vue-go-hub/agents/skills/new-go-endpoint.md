# agents/skills/new-go-endpoint.md (Self-Contained v2.1)

## Context Refreinforcement (Recency Anchor)
*Stop! Read these conventions before action. Do NOT refer back to other files.*
- **Backend Path:** `backend/internal/`
- **Naming:** Handlers must follow `HandleResourceAction(w, r)`.
- **Response:** Use the `StatusSuccess` and `StatusError` envelopes.
- **Tests:** Create `_test.go` file in the same directory as the target logic.

## Step-by-Step Recipe
1. **SENSE:** Map the endpoint name to `REGIONAL_MAP.md`.
2. **PLAN:** Create an execution plan as an Architect model.
3. **ACT (EDITOR):**
   - Implement data struct in `internal/types/request.go`.
   - Implement handlers via **Search/Replace Block**.
4. **REFLECT:** 
   - Create isolated shadow test: `__shadow_{ts}_route_test.go`.
   - Run: `go test -v -tags=shadow_test .`.
5. **CLEAN:** Delete shadow test and report success.

## Verification Gate
- [ ] LSP returns zero errors in domain package.
- [ ] Shadow test exit code is 0.
- [ ] Clarify if user wants Offset or Cursor pagination.
