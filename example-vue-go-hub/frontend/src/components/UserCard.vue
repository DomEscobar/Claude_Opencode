<script setup lang="ts">
defineProps<{
  name: string
  email: string
}>()
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6 text-left max-w-sm mx-auto">
    <p class="font-semibold text-gray-900">{{ name }}</p>
    <p class="text-sm text-gray-500">{{ email }}</p>
  </div>
</template>
