import { defineStore } from 'pinia'
import { ref } from 'vue'

interface AuthUser {
  id: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const isAuthenticated = ref(false)

  async function login(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (data.success) {
      user.value = data.data
      isAuthenticated.value = true
    }
    return data
  }

  function logout() {
    user.value = null
    isAuthenticated.value = false
  }

  return { user, isAuthenticated, login, logout }
})
