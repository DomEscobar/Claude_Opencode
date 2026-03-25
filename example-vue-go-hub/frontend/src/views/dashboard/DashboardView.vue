<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<template>
  <div class="p-8">
    <h2 class="text-2xl font-bold text-gray-900">Dashboard</h2>
    <p v-if="auth.isAuthenticated" class="mt-2 text-gray-600">
      Welcome, {{ auth.user?.email }}
    </p>
    <p v-else class="mt-2 text-gray-600">Please log in.</p>
  </div>
</template>
