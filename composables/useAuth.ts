import { useAuthStore } from '~/store/auth'

interface LoginCredentials {
  tckn: string
  password: string
}

interface RegisterData {
  email: string
  username: string
  phoneNumber: string
  tckn: string
  password: string
  firstName: string
  lastName: string
  profession?: string
  birthDate: string
}

export const useAuth = () => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()

  // Store tokens in cookies
  const storeTokens = (accessToken: string, refreshToken: string, expiresIn: number) => {
    const tokenCookie = useCookie(config.public.tokenCookieName as string, {
      secure: true,
      sameSite: 'strict',
      maxAge: expiresIn
    })
    const refreshTokenCookie = useCookie(config.public.refreshTokenCookieName as string, {
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    tokenCookie.value = accessToken
    refreshTokenCookie.value = refreshToken
  }

  // Clear tokens from cookies
  const clearTokens = () => {
    const tokenCookie = useCookie(config.public.tokenCookieName as string)
    const refreshTokenCookie = useCookie(config.public.refreshTokenCookieName as string)
    
    tokenCookie.value = null
    refreshTokenCookie.value = null
  }

  // Login function
  const login = async (credentials: LoginCredentials) => {
    authStore.setLoading(true)
    authStore.clearError()

    try {
      // Basic validation
      if (!credentials.tckn || credentials.tckn.length !== 11) {
        const error = 'TC Kimlik Numarası 11 haneli olmalıdır'
        authStore.setError(error)
        return { success: false, error }
      }

      if (!credentials.password || credentials.password.length < 6) {
        const error = 'Şifre en az 6 karakter olmalıdır'
        authStore.setError(error)
        return { success: false, error }
      }

      // Call API
      const api = useApi()
      const response = await api.auth.login(credentials)

      if (response.isSuccess && response.data) {
        // Store tokens
        storeTokens(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.expiresIn
        )

        // Update store with user info from JWT
        authStore.setUser(response.data.user)
        authStore.setAuthenticated(true)

        return { success: true, data: response.data }
      } else {
        const error = response.error || 'Giriş yapılırken bir hata oluştu'
        authStore.setError(error)
        return { success: false, error }
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Beklenmeyen bir hata oluştu'
      authStore.setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      authStore.setLoading(false)
    }
  }

  // Register function
  const register = async (userData: RegisterData) => {
    authStore.setLoading(true)
    authStore.clearError()

    try {
      const api = useApi()
      const response = await api.auth.register(userData)

      if (response.isSuccess) {
        return { success: true, message: response.data?.message || 'Kayıt başarılı' }
      } else {
        const error = response.error || 'Kayıt olurken bir hata oluştu'
        authStore.setError(error)
        return { success: false, error }
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Beklenmeyen bir hata oluştu'
      authStore.setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      authStore.setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    authStore.setLoading(true)

    try {
      // Clear tokens and state
      clearTokens()
      authStore.clearAuth()
      
      // Redirect to login page
      await navigateTo('/auth/login')
      return { success: true }
    } catch (error: any) {
      console.error('Logout error:', error)
      // Even if something fails, clear local state
      clearTokens()
      authStore.clearAuth()
      return { success: true }
    } finally {
      authStore.setLoading(false)
    }
  }

  // Forgot password function
  const forgotPassword = async (data: { tckn: string; phoneNumber: string }) => {
    authStore.setLoading(true)
    authStore.clearError()

    try {
      const api = useApi()
      const response = await api.auth.forgotPassword(data)

      if (response.isSuccess) {
        return { success: true, message: response.data || 'Şifre sıfırlama kodu gönderildi' }
      } else {
        const error = response.error || 'Şifre sıfırlama isteği gönderilemedi'
        authStore.setError(error)
        return { success: false, error }
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Beklenmeyen bir hata oluştu'
      authStore.setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      authStore.setLoading(false)
    }
  }

  // Check authentication status
  const checkAuth = () => {
    const tokenCookie = useCookie(config.public.tokenCookieName as string)
    
    if (tokenCookie.value) {
      authStore.setAuthenticated(true)
      // Optionally fetch user profile
      return true
    } else {
      authStore.setAuthenticated(false)
      authStore.setUser(null)
      return false
    }
  }

  return {
    // Actions
    login,
    register,
    logout,
    forgotPassword,
    checkAuth,
    
    // State (computed refs from store)
    user: computed(() => authStore.currentUser),
    authenticated: computed(() => authStore.isAuthenticated),
    loading: computed(() => authStore.isLoading),
    error: computed(() => authStore.errorMessage),
    hasError: computed(() => authStore.hasError),
    
    // Helper methods
    clearError: () => authStore.clearError(),
  }
} 