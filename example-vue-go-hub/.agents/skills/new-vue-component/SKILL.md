---
name: new-vue-component
description: Create a new Vue 3 component with typed props, optional Pinia store, and unit test. Use when the user asks to add a UI component, page, or widget.
---

# Skill: New Vue Component

## Steps

1. Create `frontend/src/components/{ComponentName}.vue`:
   ```vue
   <script setup lang="ts">
   defineProps<{ /* typed props */ }>()
   </script>
   <template>
     <div class="...">...</div>
   </template>
   ```
2. If the component needs shared state, create a Pinia store in `frontend/src/stores/{domain}.ts`.
3. Create a test at `frontend/src/components/__tests__/{ComponentName}.spec.ts`.

## Verify
- `pnpm typecheck` exits with 0.
- `pnpm test:unit` exits with 0.
