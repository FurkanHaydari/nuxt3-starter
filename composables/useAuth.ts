import { useAuthStore } from '~/store/auth'

interface LoginCredentials {
  tcknOrMemberNumber: string
  password: string
  rememberMe?: boolean
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

interface RegisterRequestData {
  firstName: string
  lastName: string
  tckn: string
  birthDate: string
  email: string
  phoneNumber: string
  professionId: number
  password: string
  marketingConsent: boolean
  electronicCommunicationConsent: boolean
  membershipAgreementConsent: boolean
}

interface VerifyRegistrationData {
  phoneNumber: string
  otpCode: string
}

// TCKN or Member Number validation function
const validateTckn = (input: string): { isValid: boolean; error?: string } => {
  if (!input || input.trim() === '') {
    return { isValid: false, error: 'TC Kimlik No / Üye No girilmesi zorunludur.' }
  }

  // TC Kimlik numarası kontrolü (11 haneli)
  if (input.length === 11 && /^\d{11}$/.test(input)) {
    // First digit cannot be 0
    if (input[0] === '0') {
      return { isValid: false, error: 'TC Kimlik numaranızı tekrar kontrol edin.' }
    }

    // TCKN algorithm
    const digits = input.split('').map(Number)
    const odd = digits[0] + digits[2] + digits[4] + digits[6] + digits[8]
    const even = digits[1] + digits[3] + digits[5] + digits[7]
    const digit10 = ((odd * 7) - even) % 10
    const digit11 = (digits.slice(0, 10).reduce((a, b) => a + b, 0)) % 10

    if (digit10 !== digits[9] || digit11 !== digits[10]) {
      return { isValid: false, error: 'TC Kimlik numaranızı tekrar kontrol edin.' }
  }

  return { isValid: true }
  }
  
  // Üye numarası kontrolü (alfanumerik, 6-20 karakter)
  if (input.length >= 6 && input.length <= 20) {
    if (!/^[a-zA-Z0-9]+$/.test(input)) {
      return { isValid: false, error: 'Üye numarası sadece harf ve rakam içerebilir.' }
    }
    
    return { isValid: true }
  }

  // Ne TCKN ne de geçerli member number
  return { isValid: false, error: 'Geçerli bir TC kimlik numarası (11 haneli) veya üye numarası (6-20 karakter) giriniz.' }
}

// Password validation function (for login - basic validation)
const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password || password.trim() === '') {
    return { isValid: false, error: 'Şifre girilmesi zorunludur.' }
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Şifre en az 8 karakter olmalıdır.' }
  }

  return { isValid: true }
}

// Strong password validation function (for registration)
const validateStrongPassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password || password.trim() === '') {
    return { isValid: false, error: 'Şifre girilmesi zorunludur.' }
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Şifre en az 8 karakter olmalıdır.' }
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Şifre en az bir büyük harf içermelidir.' }
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Şifre en az bir küçük harf içermelidir.' }
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Şifre en az bir rakam içermelidir.' }
  }

  if (!/[!@#$%^&*()_+\[\]{}|;:,.?"'<>-]/.test(password)) {
    return { isValid: false, error: 'Şifre en az bir özel karakter içermelidir.' }
  }

  return { isValid: true }
}

// Remember me functionality
const useRememberMe = () => {
  const config = useRuntimeConfig()
  
  const saveCredentials = (tcknOrMemberNumber: string, password: string) => {
    if (process.client) {
      localStorage.setItem('rememberedTcknOrMemberNumber', tcknOrMemberNumber)
      localStorage.setItem('rememberedPassword', password)
      localStorage.setItem('rememberMe', 'true')
    }
  }

  const getRememberedCredentials = () => {
    if (process.client) {
      const rememberMe = localStorage.getItem('rememberMe') === 'true'
      if (rememberMe) {
        return {
          tcknOrMemberNumber: localStorage.getItem('rememberedTcknOrMemberNumber') || '',
          password: localStorage.getItem('rememberedPassword') || '',
          rememberMe: true
        }
      }
    }
    return { tcknOrMemberNumber: '', password: '', rememberMe: false }
  }

  const clearRememberedCredentials = () => {
    if (process.client) {
      // Clear new keys
      localStorage.removeItem('rememberedTcknOrMemberNumber')
      localStorage.removeItem('rememberedPassword')
      localStorage.removeItem('rememberMe')
      
      // Also clear old keys for backward compatibility
      localStorage.removeItem('rememberedTckn')
    }
  }

  return {
    saveCredentials,
    getRememberedCredentials,
    clearRememberedCredentials
  }
}

export const useAuth = () => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  const { saveCredentials, getRememberedCredentials, clearRememberedCredentials } = useRememberMe()

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

  // Client-side validation
  const validateLoginForm = (credentials: LoginCredentials) => {
    const tcknValidation = validateTckn(credentials.tcknOrMemberNumber)
    if (!tcknValidation.isValid) {
      return { isValid: false, error: tcknValidation.error }
    }

    const passwordValidation = validatePassword(credentials.password)
    if (!passwordValidation.isValid) {
      return { isValid: false, error: passwordValidation.error }
    }

    return { isValid: true }
  }

  // Login function
  const login = async (credentials: LoginCredentials) => {
    authStore.setLoading(true)
    authStore.clearError()

    try {
      // Client-side validation - only basic checks
      const validation = validateLoginForm(credentials)
      if (!validation.isValid) {
        authStore.setError(validation.error!)
        return { success: false, error: validation.error }
      }

      // Call API
      const api = useApi()
      const response = await api.auth.login({
        tcknOrMemberNumber: credentials.tcknOrMemberNumber,
        password: credentials.password
      })

      if (response.isSuccess && response.data) {
        // Store tokens
        storeTokens(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.expiresIn
        )

        // Handle remember me
        if (credentials.rememberMe) {
          saveCredentials(credentials.tcknOrMemberNumber, credentials.password)
        } else {
          clearRememberedCredentials()
        }

        // Update store with user info from JWT
        authStore.setUser(response.data.user)
        authStore.setAuthenticated(true)

        return { success: true, data: response.data }
      } else {
        // Debug: Log the full response for troubleshooting
        console.log('Login failed - Full response:', response)
        
        // Map backend authentication errors to specific messages
        let errorMessage = 'Giriş yapılırken bir hata oluştu'
        
        // Handle specific authentication scenarios according to requirements
        if (response.error?.includes('User not found') || 
            response.error?.includes('not found') ||
            response.error?.includes('does not exist') ||
            response.error?.includes('kullanıcı bulunmamaktadır')) {
          // Senaryo-1: Hem TC Kimlik No hem de Şifre değeri eşleşmiyorsa (kullanıcı bulunamadı)
          errorMessage = 'Böyle bir kullanıcı bulunmamaktadır. Lütfen kontrol edip tekrar deneyiniz.'
        } else if (response.error?.includes('Invalid password') ||
                   response.error?.includes('Invalid TCKN or password') || 
                   response.error?.includes('Invalid login') ||
                   response.error?.includes('TCKN or password') ||
                   response.error?.includes('Invalid credentials')) {
          // Senaryo-2: Değerlerden biri doğru, diğeri yanlış ise (şifre hatalı)
          errorMessage = 'TC Kimlik No / Üye No veya Şifre hatalı.'
        } else {
          // For any other backend error (including validation), show generic message
          errorMessage = 'TC Kimlik No / Üye No veya Şifre hatalı.'
        }

        console.log('Mapped error message:', errorMessage)
        authStore.setError(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Beklenmeyen bir hata oluştu'
      authStore.setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      authStore.setLoading(false)
    }
  }

  // Register function (legacy)
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

  // SMS OTP Registration - Step 1: Request registration with SMS OTP
  const registerRequest = async (userData: RegisterRequestData) => {
    authStore.setLoading(true)
    authStore.clearError()

    try {
      const api = useApi()
      const response = await api.auth.registerRequest(userData)

      if (response.isSuccess) {
        return { success: true, message: response.data?.message || 'SMS kodu gönderildi' }
      } else {
        const error = response.error || 'SMS kodu gönderilirken bir hata oluştu'
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

  // SMS OTP Registration - Step 2: Verify OTP and complete registration
  const verifyRegistration = async (data: VerifyRegistrationData) => {
    authStore.setLoading(true)
    authStore.clearError()

    try {
      const api = useApi()
      const response = await api.auth.verifyRegistration(data)

      if (response.isSuccess && response.data?.success) {
        return { success: true, message: response.data?.message || 'Kayıt başarıyla tamamlandı' }
      } else {
        // Use the specific error message from data.message if available
        const error = response.data?.message || response.error || 'SMS doğrulama başarısız'
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
      clearRememberedCredentials()
      authStore.clearAuth()
      
      // Redirect to login page
      await navigateTo('/auth/login')
      return { success: true }
    } catch (error: any) {
      console.error('Logout error:', error)
      // Even if something fails, clear local state
      clearTokens()
      clearRememberedCredentials()
      authStore.clearAuth()
      return { success: true }
    } finally {
      authStore.setLoading(false)
    }
  }

  // Forgot password function (Step 1: TC + Birth Date)
  const forgotPassword = async (data: { tckn: string; birthDate: string }) => {
    authStore.setLoading(true)
    authStore.clearError()

    try {
      const api = useApi()
      const response = await api.auth.forgotPassword({
        tcknOrMemberNumber: data.tckn,
        birthDate: data.birthDate
      })

      if (response.isSuccess) {
        return { success: true, data: response.data }
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

  // Select reset method function (Step 2: Email/SMS Selection)
  const selectResetMethod = async (data: { tckn: string; birthDate: string; method: number }) => {
    authStore.setLoading(true)
    authStore.clearError()

    try {
      const api = useApi()
      const response = await api.auth.selectResetMethod({
        tcknOrMemberNumber: data.tckn,
        birthDate: data.birthDate,
        method: data.method
      })

      if (response.isSuccess) {
        return { success: true, message: response.data || 'Şifre sıfırlama bağlantısı gönderildi' }
      } else {
        const error = response.error || 'Şifre sıfırlama bağlantısı gönderilemedi'
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
  const checkAuth = async () => {
    const tokenCookie = useCookie(config.public.tokenCookieName as string)
    
    if (tokenCookie.value) {
      authStore.setAuthenticated(true)
      
      // If user data is not in store, fetch from API
      if (!authStore.currentUser) {
        try {
          const api = useApi()
          const response = await api.profile.getProfile()
          
          if (response.isSuccess && response.data) {
            authStore.setUser({
              id: response.data.id,
              email: response.data.email,
              username: response.data.username,
              firstName: response.data.firstName,
              lastName: response.data.lastName,
              phoneNumber: response.data.phoneNumber,
              profession: response.data.profession,
              isEmailVerified: response.data.isEmailVerified,
              isPhoneVerified: true, // Always true after registration
              status: response.data.isActive ? 'ACTIVE' : 'INACTIVE',
              role: response.data.roles?.[0] || 'user'
            })
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error)
          // If profile fetch fails but token exists, keep authenticated but without user data
        }
      }
      
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
    registerRequest,
    verifyRegistration,
    logout,
    forgotPassword,
    selectResetMethod,
    checkAuth,
    
    // State (computed refs from store)
    user: computed(() => authStore.currentUser),
    authenticated: computed(() => authStore.isAuthenticated),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    loading: computed(() => authStore.isLoading),
    error: computed(() => authStore.errorMessage),
    hasError: computed(() => authStore.hasError),
    
    // Helper methods
    clearError: () => authStore.clearError(),
    
    // Validation methods
    validateTckn,
    validatePassword,
    validateStrongPassword,
    validateLoginForm,
    
    // Remember me functionality
    getRememberedCredentials,
    clearRememberedCredentials,
  }
} 