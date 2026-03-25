<script setup lang="ts">
import UserCard from './components/UserCard.vue'
</script>

<template>
  <main class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center space-y-6">
      <h1 class="text-3xl font-bold text-gray-900">Vue + Go Hub</h1>
      <p class="text-gray-600">Template is running. Start building.</p>
      <UserCard name="Example User" email="user@example.com" />
    </div>
  </main>
</template>
