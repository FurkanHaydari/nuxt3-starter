import { $fetch, type FetchOptions } from 'ofetch'

// Backend API Response Types (what we receive from .NET API)
interface BackendApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  errors?: string[] | null
}

interface BackendLoginData {
  userId: string
  email: string
  username: string
  accessToken: string
  refreshToken: string
  expiresAt: string
  roles: string[]
}

// Frontend Domain Types (what we use in our app)
interface ApiResponse<T = any> {
  isSuccess: boolean
  data?: T
  message?: string
  error?: string
}

interface LoginRequest {
  tckn: string
  password: string
}

interface RegisterRequest {
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

interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: {
    id: string
    email: string
    username: string
    firstName?: string
    lastName?: string
    phoneNumber?: string
    profession?: string
    isEmailVerified: boolean
    isPhoneVerified: boolean
    status: string
    role: string
  }
}

interface RegisterResponse {
  message: string
  userId: string
}

interface ForgotPasswordRequest {
  tckn: string
  phoneNumber: string
}

interface ResetPasswordRequest {
  token: string
  newPassword: string
}

interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

interface UpdateProfileRequest {
  username?: string
  profession?: string
}

interface UpdateEmailRequest {
  newEmail: string
}

interface UpdatePhoneRequest {
  newPhoneNumber: string
}

interface VerifyEmailRequest {
  newEmail: string
  verificationCode: string
}

interface VerifyPhoneRequest {
  newPhoneNumber: string
  verificationCode: string
}

export const useApi = () => {
  const config = useRuntimeConfig()

  // JWT Decoder Helper
  const decodeJwtPayload = (token: string) => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('JWT decode error:', error)
      return null
    }
  }

  // Mapper Functions (Domain Transformation)
  const mapLoginResponse = (backendData: BackendLoginData): LoginResponse => {
    // Calculate expiresIn from expiresAt
    const expiresAt = new Date(backendData.expiresAt)
    const now = new Date()
    const expiresIn = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000))

    // Decode JWT to get user details
    const jwtPayload = decodeJwtPayload(backendData.accessToken)
    console.log('JWT Payload:', jwtPayload) // Debug

    return {
      accessToken: backendData.accessToken,
      refreshToken: backendData.refreshToken,
      expiresIn: expiresIn,
      user: {
        id: backendData.userId,
        email: backendData.email,
        username: backendData.username,
        firstName: jwtPayload?.first_name,
        lastName: jwtPayload?.last_name,
        phoneNumber: jwtPayload?.phone_number,
        profession: jwtPayload?.profession,
        isEmailVerified: jwtPayload?.email_verified === 'true',
        isPhoneVerified: jwtPayload?.phone_verified === 'true',
        status: jwtPayload?.status || 'ACTIVE',
        role: backendData.roles[0] || 'base_user'
      }
    }
  }

  const transformBackendResponse = <TBackend, TFrontend>(
    response: BackendApiResponse<TBackend>,
    mapper?: (data: TBackend) => TFrontend
  ): ApiResponse<TFrontend> => {
    return {
      isSuccess: response.success,
      data: response.data && mapper ? mapper(response.data) : (response.data as unknown as TFrontend),
      message: response.message,
      error: response.errors ? response.errors.join(', ') : undefined
    }
  }

  // Create API instance with base configuration
  const apiCall = async <TBackend, TFrontend = TBackend>(
    endpoint: string,
    options: FetchOptions<'json'> = {},
    mapper?: (data: TBackend) => TFrontend
  ): Promise<ApiResponse<TFrontend>> => {
    try {
      const response = await $fetch<BackendApiResponse<TBackend>>(endpoint, {
        baseURL: config.public.apiBaseUrl as string,
        timeout: config.public.apiTimeout as number,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      return transformBackendResponse(response, mapper)
    } catch (error: any) {
      console.error('API Error:', error)
      
      return {
        isSuccess: false,
        error: error?.data?.message || error?.message || 'An unexpected error occurred',
      }
    }
  }

  // Authenticated API call
  const authenticatedApiCall = async <TBackend, TFrontend = TBackend>(
    endpoint: string,
    options: FetchOptions<'json'> = {},
    mapper?: (data: TBackend) => TFrontend
  ): Promise<ApiResponse<TFrontend>> => {
    const tokenCookie = useCookie(config.public.tokenCookieName as string)
    
    if (!tokenCookie.value) {
      return {
        isSuccess: false,
        error: 'Authentication token not found',
      }
    }

    return apiCall<TBackend, TFrontend>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${tokenCookie.value}`,
      },
    }, mapper)
  }

  return {
    // Auth endpoints
    auth: {
      async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        return apiCall<BackendLoginData, LoginResponse>('/auth/login', {
          method: 'POST',
          body: credentials,
        }, mapLoginResponse)
      },

      async register(userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
        return apiCall<RegisterResponse>('/auth/register', {
          method: 'POST',
          body: userData,
        })
      },

      async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<string>> {
        return apiCall<string>('/auth/forgot-password', {
          method: 'POST',
          body: data,
        })
      },

      async validateTcPhone(data: ForgotPasswordRequest): Promise<ApiResponse<string>> {
        return apiCall<string>('/auth/validate-tc-phone', {
          method: 'POST',
          body: data,
        })
      },

      async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<string>> {
        return apiCall<string>('/auth/reset-password', {
          method: 'POST',
          body: data,
        })
      },

      async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<string>> {
        return authenticatedApiCall<string>('/auth/change-password', {
          method: 'POST',
          body: data,
        })
      },

      async refreshToken(refreshToken: string): Promise<ApiResponse<LoginResponse>> {
        return apiCall<LoginResponse>('/auth/refresh', {
          method: 'POST',
          body: { refreshToken },
        })
      },

      async logout(): Promise<void> {
        // Clear tokens from cookies
        const tokenCookie = useCookie(config.public.tokenCookieName as string)
        const refreshTokenCookie = useCookie(config.public.refreshTokenCookieName as string)
        
        tokenCookie.value = null
        refreshTokenCookie.value = null
      },
    },

    // Profile endpoints
    profile: {
      async getProfile(): Promise<ApiResponse<any>> {
        return authenticatedApiCall<any>('/auth/profile')
      },

      async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<string>> {
        return authenticatedApiCall<string>('/auth/profile', {
          method: 'PUT',
          body: data,
        })
      },

      async updateEmail(data: UpdateEmailRequest): Promise<ApiResponse<string>> {
        return authenticatedApiCall<string>('/auth/profile/email', {
          method: 'PUT',
          body: data,
        })
      },

      async verifyEmail(data: VerifyEmailRequest): Promise<ApiResponse<string>> {
        return authenticatedApiCall<string>('/auth/profile/verify-email', {
          method: 'POST',
          body: data,
        })
      },

      async updatePhone(data: UpdatePhoneRequest): Promise<ApiResponse<string>> {
        return authenticatedApiCall<string>('/auth/profile/phone', {
          method: 'PUT',
          body: data,
        })
      },

      async verifyPhone(data: VerifyPhoneRequest): Promise<ApiResponse<string>> {
        return authenticatedApiCall<string>('/auth/profile/verify-phone', {
          method: 'POST',
          body: data,
        })
      },
    },

    // Utility methods
    utils: {
      async testConnection(): Promise<ApiResponse<any>> {
        return apiCall<any>('/auth/test')
      },

      async getPermissions(): Promise<ApiResponse<string[]>> {
        return authenticatedApiCall<string[]>('/auth/permissions')
      },
    },
  }
} 