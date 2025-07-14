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
  statusCode?: number
}

interface LoginRequest {
  tcknOrMemberNumber: string
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

interface VerifyRegistrationRequest {
  phoneNumber: string
  otpCode: string
}

interface VerifyRegistrationResponse {
  success: boolean
  message: string
  userId?: string
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
  tcknOrMemberNumber: string
  birthDate: string
}

interface ForgotPasswordResponse {
  success: boolean
  message: string
  maskedEmail?: string
  maskedPhone?: string
  hasEmail: boolean
  hasPhone: boolean
}

interface SelectResetMethodRequest {
  tcknOrMemberNumber: string
  birthDate: string
  method: number // 1 = Email, 2 = SMS
}

interface ResetPasswordRequest {
  token: string
  newPassword: string
}

interface ChangePasswordRequest {
  tcKimlikNo: string
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
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

interface ValidateResetTokenRequest {
  token: string
}

interface ValidateResetTokenResponse {
  isValid: boolean
  message?: string
  expiresAt?: string
}

interface ProfessionDto {
  id: number
  name: string
  isActive: boolean
  sortOrder: number
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
    mapper?: (data: TBackend) => TFrontend,
    statusCode?: number
  ): ApiResponse<TFrontend> => {
    return {
      isSuccess: response.success,
      data: response.data && mapper ? mapper(response.data) : (response.data as unknown as TFrontend),
      message: response.message,
      error: response.errors ? response.errors.join(', ') : response.message,
      statusCode: statusCode || 200
    }
  }

  // Create API instance with base configuration
  const apiCall = async <TBackend, TFrontend = TBackend>(
    endpoint: string,
    options: FetchOptions<'json'> = {},
    mapper?: (data: TBackend) => TFrontend
  ): Promise<ApiResponse<TFrontend>> => {
    try {
      // Use $fetch.raw to get both response and status
      const rawResponse = await $fetch.raw<BackendApiResponse<TBackend>>(endpoint, {
        baseURL: config.public.apiBaseUrl as string,
        timeout: config.public.apiTimeout as number,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      return transformBackendResponse(rawResponse._data!, mapper, rawResponse.status)
    } catch (error: any) {
      console.error('API Error:', error)
      
      // Handle different error response formats
      let errorMessage = 'An unexpected error occurred'
      
      if (error?.data) {
        // Backend returned structured error response
        
        // Handle ASP.NET Core ProblemDetails format first
        if (error.data.detail) {
          errorMessage = error.data.detail
        } else if (error.data.title) {
          errorMessage = error.data.title
        } else if (error.data.message) {
          errorMessage = error.data.message
        } else if (error.data.error) {
          // Some APIs return error field instead of message
          errorMessage = error.data.error
        } else if (error.data.errors) {
          // Handle ASP.NET Core validation errors format
          if (Array.isArray(error.data.errors)) {
            // Format: ["Error 1", "Error 2"] or from ProblemDetails.Extensions["errors"]
            errorMessage = error.data.errors.join(', ')
          } else if (typeof error.data.errors === 'object') {
            // Format: { "Password": ["Error message"], "Email": ["Another error"] }
            const errorMessages = []
            for (const [field, messages] of Object.entries(error.data.errors)) {
              if (Array.isArray(messages)) {
                errorMessages.push(...messages)
              } else {
                errorMessages.push(messages as string)
              }
            }
            errorMessage = errorMessages.join(', ')
          }
        } else if (typeof error.data === 'string') {
          errorMessage = error.data
        }
        
      } else if (error?.response?.data) {
        // Alternative error response format
        if (error.response.data.detail) {
          errorMessage = error.response.data.detail
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error
        }
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      return {
        isSuccess: false,
        error: errorMessage,
        statusCode: error?.status || error?.statusCode || 500
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
        statusCode: 401
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

      async registerRequest(userData: RegisterRequestData): Promise<ApiResponse<RegisterResponse>> {
        return apiCall<RegisterResponse>('/auth/register-request', {
          method: 'POST',
          body: userData,
        })
      },

      async verifyRegistration(data: VerifyRegistrationRequest): Promise<ApiResponse<VerifyRegistrationResponse>> {
        return apiCall<VerifyRegistrationResponse>('/auth/verify-registration', {
          method: 'POST',
          body: data,
        })
      },

      async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<ForgotPasswordResponse>> {
        return apiCall<ForgotPasswordResponse>('/auth/forgot-password', {
          method: 'POST',
          body: data,
        })
      },

      async selectResetMethod(data: SelectResetMethodRequest): Promise<ApiResponse<string>> {
        return apiCall<string>('/auth/select-reset-method', {
          method: 'POST',
          body: data,
        })
      },

      async validateResetToken(data: ValidateResetTokenRequest): Promise<ApiResponse<ValidateResetTokenResponse>> {
        return apiCall<ValidateResetTokenResponse>('/auth/validate-reset-token', {
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
        return apiCall<string>('/auth/reset-password-with-token', {
          method: 'POST',
          body: data,
        })
      },

      async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<string>> {
        return apiCall<string>('/auth/change-password', {
          method: 'POST',
          body: data,
        })
      },

      async refreshToken(refreshToken: string): Promise<ApiResponse<LoginResponse>> {
        return apiCall<BackendLoginData, LoginResponse>('/auth/refresh', {
          method: 'POST',
          body: { refreshToken },
        }, mapLoginResponse)
      },

      async logout(): Promise<void> {
        // Just clear local state, no server call needed
        return Promise.resolve()
      },

      async getProfile(): Promise<ApiResponse<any>> {
        return authenticatedApiCall<any>('/auth/profile', {
          method: 'GET',
        })
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
      }
    },

    // Profession endpoints
    profession: {
      async getProfessions(): Promise<ApiResponse<ProfessionDto[]>> {
        return apiCall<ProfessionDto[]>('/professions', {
          method: 'GET',
        })
      }
    },

    // Profile endpoints
    profile: {
      async getProfile(): Promise<ApiResponse<any>> {
        return authenticatedApiCall<any>('/auth/profile', {
          method: 'GET',
        })
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