---
name: add-api-client-method
description: Bridge a backend Go endpoint to the Vue frontend by creating matching TypeScript types and a Pinia store method. Use when a new backend endpoint needs frontend integration, or a feature requires both backend and frontend changes.
---

# Skill: Add API Client Method (Full-Stack Bridge)

## Before you start
- Confirm the backend endpoint exists and its tests pass.
- Read the request/response types in `backend/internal/types/`.
- Read the relevant Pinia store in `frontend/src/stores/` or create a new one.

## Steps

1. **Verify the backend contract:**
   - Read the handler to understand the HTTP method, path, request body, and response shape.
   - Read the types in `backend/internal/types/` to get the exact field names and types.

2. **Create or update the TypeScript types:**
   - Define matching interfaces in the frontend that mirror the Go types.
   - Field names should match the JSON tags in the Go structs (usually `snake_case` in JSON).

3. **Add the API call in the appropriate Pinia store:**
   ```typescript
   async function createResource(payload: CreateResourceRequest) {
     const res = await fetch('/api/resources', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(payload),
     })
     const data = await res.json()
     if (!data.success) throw new Error(data.message)
     return data.data
   }
   ```

4. **Use the store method in the component:**
   - Import the store with `useXxxStore()`
   - Call the action from a handler or lifecycle hook
   - Handle loading and error states in the template

5. **Test both sides:**
   - Backend: existing endpoint tests should pass
   - Frontend: `pnpm typecheck` to verify type alignment
   - Frontend: `pnpm test:unit` if component tests exist

## Type Alignment Checklist
- [ ] Every JSON field from the Go struct has a matching TypeScript property
- [ ] Nullable Go fields (`*string`, `omitempty`) are optional in TypeScript (`field?: string`)
- [ ] Date fields (`time.Time`) are handled as `string` in TypeScript (ISO 8601)
- [ ] The response is unwrapped from the `APIResponse` envelope before use

## Verify
- `pnpm typecheck` exits with 0.
- `go test ./internal/...` exits with 0.
- The Vite dev server proxies `/api` requests to the backend without CORS errors.
