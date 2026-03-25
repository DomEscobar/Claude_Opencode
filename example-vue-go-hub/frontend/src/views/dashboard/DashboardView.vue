<script setup lang="ts">
import UserCard from '@/components/UserCard.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center space-y-6">
      <h1 class="text-3xl font-bold text-gray-900">Vue + Go Hub</h1>
      <p v-if="auth.isAuthenticated" class="text-gray-600">
        Welcome, {{ auth.user?.email }}
      </p>
      <p v-else class="text-gray-600">Template is running. Start building.</p>
      <UserCard name="Example User" email="user@example.com" />
    </div>
  </div>
</template>
