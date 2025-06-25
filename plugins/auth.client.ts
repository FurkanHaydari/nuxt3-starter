import { useAuthStore } from '~/store/auth'

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  const { checkAuth } = useAuth()
 
  // Hydrate auth state from cookies on app startup
  authStore.hydrate()
  
  // If authenticated, fetch user profile
  if (authStore.isAuthenticated) {
    await checkAuth()
  }
}) 