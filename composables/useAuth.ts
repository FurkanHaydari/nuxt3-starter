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

// Helper function to determine if an error should be shown at field level vs modal level
const isFieldLevelError = (errorMessage: string): boolean => {
  const errorLower = errorMessage.toLowerCase()
  
  // System/service level errors should be shown in modal (these take priority)
  const systemErrorKeywords = [
    'mernis', 'nvi', 'kimlik doğrulama sistemi',
    'sistem', 'system', 'service', 'hizmet',
    'server', 'sunucu', 'bağlantı', 'connection',
    'timeout', 'zaman aşımı', 'geçici', 'temporary',
    'one or more validation errors', 'validation errors occurred',
    'doğrulanamadı', 'verification failed', 'could not verify'
  ]
  
  // Check if it's a system error first (these take priority)
  if (systemErrorKeywords.some(keyword => errorLower.includes(keyword))) {
    return false // Show in modal
  }
  
  // Field-level errors are those that relate to specific form fields and are simple format errors
  const fieldErrorKeywords = [
    'already exists', 'zaten mevcut', 'kayıtlı',
    'invalid format', 'geçersiz format', 'format',
    'too short', 'too long', 'çok kısa', 'çok uzun',
    'required', 'zorunlu', 'gerekli'
  ]
  
  // Check if it's a field error and also mentions a specific field
  const fieldMentioned = [
    'email', 'e-posta', 'mail',
    'telefon', 'phone', 'tel',
    'şifre', 'password', 'parola',
    'ad', 'name', 'isim',
    'soyad', 'surname', 'lastname',
    'meslek', 'profession'
  ]
  
  const hasFieldKeyword = fieldErrorKeywords.some(keyword => errorLower.includes(keyword))
  const hasFieldMention = fieldMentioned.some(field => errorLower.includes(field))
  
  if (hasFieldKeyword && hasFieldMention) {
    return true // Show under field
  }
  
  // Default: if unclear, show in modal for better UX
  return false
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
      // Frontend validation artık field level'da yapılacak, burada sadece API call
      // Client-side validation sadece boş field kontrolü yapacak
      if (!credentials.tcknOrMemberNumber.trim() || !credentials.password.trim()) {
        const error = 'Tüm alanları doldurmanız gerekmektedir.'
        authStore.setError(error)
        return { success: false, error, isFieldError: false }
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
        
        // Deterministik error handling - HTTP status code ve response structure'a göre
        let errorMessage = 'Giriş yapılırken bir hata oluştu'
        
        // Backend'den gelen specific error response'ları kontrol et
        if (response.statusCode === 400) {
          // Bad Request - validation errors
          errorMessage = 'Girilen bilgiler doğrulanamadı. Lütfen TC Kimlik No ve diğer bilgilerinizi kontrol edip tekrar deneyiniz.'
        } else if (response.statusCode === 401) {
          // Unauthorized - invalid credentials
          errorMessage = 'TC Kimlik No / Üye No veya Şifre hatalı.'
        } else if (response.statusCode === 404) {
          // Not Found - user not found
          errorMessage = 'Böyle bir kullanıcı bulunmamaktadır. Lütfen kontrol edip tekrar deneyiniz.'
        } else if (response.statusCode === 422) {
          // Unprocessable Entity - validation failed (MERNIS etc.)
          errorMessage = 'Girilen TC Kimlik No bilgileri doğrulanamadı. Lütfen TC Kimlik No\'nuzu kontrol edip tekrar deneyiniz.'
        } else if (response.statusCode === 500) {
          // Internal Server Error
          errorMessage = 'Sistemde geçici bir sorun oluştu. Lütfen daha sonra tekrar deneyiniz.'
        } else {
          // Default for any other status codes
          errorMessage = 'TC Kimlik No / Üye No veya Şifre hatalı.'
        }

        console.log('Mapped error message:', errorMessage)
        authStore.setError(errorMessage)
        return { success: false, error: errorMessage, isFieldError: false }
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Beklenmeyen bir hata oluştu'
      authStore.setError(errorMessage)
      return { success: false, error: errorMessage, isFieldError: false }
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
        return { success: true, message: response.data?.message || 'Kayıt başarılı', isFieldError: false }
      } else {
        const error = response.error || 'Kayıt olurken bir hata oluştu'
        authStore.setError(error)
        return { success: false, error, isFieldError: false }
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Beklenmeyen bir hata oluştu'
      authStore.setError(errorMessage)
      return { success: false, error: errorMessage, isFieldError: false }
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
        return { success: true, message: response.data?.message || 'SMS kodu gönderildi', isFieldError: false }
      } else {
        const error = response.error || 'SMS kodu gönderilirken bir hata oluştu'
        
        // Determine if this is a field-level error by checking content
        const isFieldError = isFieldLevelError(error)
        
        authStore.setError(error)
        return { success: false, error, isFieldError }
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Beklenmeyen bir hata oluştu'
      authStore.setError(errorMessage)
      return { success: false, error: errorMessage, isFieldError: false }
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
        return { success: true, message: response.data?.message || 'Kayıt başarıyla tamamlandı', isFieldError: false }
      } else {
        // Use the specific error message from data.message if available
        const error = response.data?.message || response.error || 'SMS doğrulama başarısız'
        
        // Determine if this is a field-level error
        const isFieldError = isFieldLevelError(error)
        
        authStore.setError(error)
        return { success: false, error, isFieldError }
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Beklenmeyen bir hata oluştu'
      authStore.setError(errorMessage)
      return { success: false, error: errorMessage, isFieldError: false }
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
        return { success: true, data: response.data, isFieldError: false }
      } else {
        const error = response.error || 'Şifre sıfırlama isteği gönderilemedi'
        authStore.setError(error)
        return { success: false, error, isFieldError: false }
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Beklenmeyen bir hata oluştu'
      authStore.setError(errorMessage)
      return { success: false, error: errorMessage, isFieldError: false }
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
        return { success: true, message: response.data || 'Şifre sıfırlama bağlantısı gönderildi', isFieldError: false }
      } else {
        const error = response.error || 'Şifre sıfırlama bağlantısı gönderilemedi'
        authStore.setError(error)
        return { success: false, error, isFieldError: false }
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Beklenmeyen bir hata oluştu'
      authStore.setError(errorMessage)
      return { success: false, error: errorMessage, isFieldError: false }
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