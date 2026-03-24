# agents/skills/new-vue-component.md

## Trigger
User asks to create a new UI component, page, or widget.

## Steps
1. Create `src/components/{ComponentName}.vue` using the standard Vue 3 template:
   ```vue
   <script setup lang="ts">
   defineProps<{ ... }>();
   </script>
   <template>
     <div class="...">...</div>
   </template>
   ```
2. If state is needed, create a Pinia store in `src/stores/{domain}.ts`.
3. Add a test in `src/components/__tests__/{ComponentName}.spec.ts`.

## Verification
- Run `pnpm typecheck`
- Run `pnpm test:unit`
