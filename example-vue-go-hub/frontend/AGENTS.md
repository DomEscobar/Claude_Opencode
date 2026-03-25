# Frontend AGENTS.md

## Stack
Vue 3 + Vite + Pinia + Tailwind CSS. Source code lives in `frontend/`.

## Rules
- **[FE-1]** Components must be `.vue` Single File Components using `<script setup lang="ts">`.
- **[FE-2]** Never use `v-html` unless the content is sanitized.
- **[FE-3]** Use Tailwind utility classes for styling. Custom `<style>` blocks only for theme extensions.
- **[FE-4]** All component props must have TypeScript type definitions.
- **[FE-5]** No `as any` casts. If a type is missing, define it.
- **[FE-6]** API calls go through Pinia stores, not directly in components.

## Conventions
- Component names: PascalCase (e.g. `UserCard.vue`).
- State management: Pinia stores in `src/stores/`.
- Views/pages: `src/views/`.
- Reusable components: `src/components/`.
- Tests: `src/components/__tests__/` for component tests.

## Commands (project-wide)
```bash
pnpm dev          # Start Vite dev server on :5173 (proxies /api to backend)
pnpm build        # Production build
pnpm typecheck    # Run vue-tsc type checking
pnpm test:unit    # Run Vitest unit tests
pnpm lint         # Run ESLint
```

## Commands (single-file -- prefer these for faster feedback)
```bash
pnpm exec vue-tsc --noEmit                              # Typecheck all (fast)
pnpm exec eslint --fix src/components/UserCard.vue       # Lint one file
pnpm exec vitest run src/components/__tests__/UserCard.spec.ts  # Test one file
```

## Examples to Follow
- Component with typed props: `src/components/UserCard.vue`
- Pinia store with async actions: `src/stores/auth.ts`
- Page/view component: `src/views/dashboard/DashboardView.vue`
- App entry with Pinia setup: `src/main.ts`

## Anti-Patterns
- Don't create `<style>` blocks -- use Tailwind utility classes
- Don't use `as any` or `@ts-ignore`
- Don't fetch directly in components -- use Pinia stores
- Don't use Options API -- use `<script setup>` Composition API
- Don't add inline `style=""` attributes
