# AGENTS.md

## Frontend Context
Vue 3 + Vite + Pinia + Tailwind. This is the UI layer.

## Hard Rules
- [FE-1] Components MUST be in `.vue` SFC format.
- [FE-2] NEVER use `v-html` unless displaying sanitized user content.
- [FE-3] Styles MUST use Tailwind utility classes. No custom `<style>` blocks unless extending theme.

## Conventions
- Component naming: PascalCase (e.g. `UserCard.vue`).
- State: Pinia stores go in `src/stores/`.
- Props: All props MUST have defined types.

## Commands
```bash
pnpm dev              # Start Vite dev server
pnpm build            # Production build
pnpm lint             # ESLint + Prettier
```
