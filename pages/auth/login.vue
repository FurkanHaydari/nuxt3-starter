<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-body p-4">
            <div class="text-center mb-4">
              <h2 class="h4 fw-bold">Giriş Yap</h2>
              <p class="text-muted">Hesabınıza giriş yapın</p>
            </div>
            
            <!-- Error Alert - Sadece field validation errors için -->
            <div v-if="hasFieldErrors" class="alert alert-warning" role="alert">
              <i class="bi bi-exclamation-triangle me-2"></i>
              Lütfen form hatalarını düzeltin.
            </div>
            
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="tcknOrMemberNumber" class="form-label">TC Kimlik No / Üye No</label>
                <input 
                  v-model="form.tcknOrMemberNumber"
                  type="text" 
                  class="form-control" 
                  :class="{ 'is-invalid': tcknError }"
                  id="tcknOrMemberNumber" 
                  placeholder="TC Kimlik No veya Üye No"
                  :disabled="loading"
                  @input="handleTcknInput"
                  @blur="validateTcknOrMemberNumberField"
                  required>
                <div v-if="tcknError" class="invalid-feedback">
                  {{ tcknError }}
                </div>
              </div>
              
              <div class="mb-3">
                <label for="password" class="form-label">Şifre</label>
                <div class="input-group">
                  <input 
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'" 
                    class="form-control" 
                    :class="{ 'is-invalid': passwordError }"
                    id="password"
                    placeholder="Şifrenizi girin"
                    :disabled="loading"
                    @input="handlePasswordInput"
                    @blur="validatePasswordField"
                    required>
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary"
                    @click="togglePasswordVisibility"
                    :disabled="loading">
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                  <div v-if="passwordError" class="invalid-feedback">
                    {{ passwordError }}
                  </div>
                </div>
              </div>
              
              <div class="mb-3 form-check">
                <input 
                  v-model="form.rememberMe"
                  type="checkbox" 
                  class="form-check-input" 
                  id="rememberMe">
                <label class="form-check-label" for="rememberMe">
                  Beni hatırla
                </label>
              </div>
              
              <button 
                type="submit" 
                class="btn btn-primary w-100 mb-3"
                :disabled="loading || !isFormValid">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <i v-else class="bi bi-box-arrow-in-right me-2"></i>
                {{ loading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
              </button>
              
              <div class="text-center mb-3">
                <NuxtLink to="/auth/forgot-password" class="text-decoration-none">
                  Şifrenizi mi unuttunuz?
                </NuxtLink>
              </div>
              
              <hr>
              
              <div class="text-center">
                <span class="text-muted">Hesabınız yok mu? </span>
                <NuxtLink to="/auth/register" class="text-decoration-none">
                  Ücretsiz Üye Ol
                </NuxtLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Meta tags
useHead({
  title: 'Giriş Yap - BetStarter',
  meta: [
    { name: 'description', content: 'BetStarter hesabınıza giriş yapın' }
  ]
})

// Auth composable
const { 
  login, 
  loading, 
  clearError, 
  validateTckn, 
  validatePassword,
  getRememberedCredentials 
} = useAuth()

// Error handling
const {
  hasFieldErrors,
  getFieldError,
  validateField,
  validateForm,
  handleInputChange,
  handleBackendError,
  handleSuccess,
  clearAllFieldErrors
} = useErrorHandling()

// Reactive form data
const form = reactive({
  tcknOrMemberNumber: '',
  password: '',
  rememberMe: false
})

// Local state
const showPassword = ref(false)

// Computed properties
const tcknError = computed(() => getFieldError('tckn'))
const passwordError = computed(() => getFieldError('password'))

// Form validation
const isFormValid = computed(() => {
  return form.tcknOrMemberNumber && 
         form.password && 
         !hasFieldErrors.value
})

// Load remembered credentials on mount
onMounted(() => {
  const remembered = getRememberedCredentials()
  if (remembered.rememberMe) {
    form.tcknOrMemberNumber = remembered.tcknOrMemberNumber
    form.password = remembered.password
    form.rememberMe = remembered.rememberMe
  }
})

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// Field validations
const validateTcknOrMemberNumberField = () => {
  return validateField('tckn', form.tcknOrMemberNumber, validateTckn)
}

const validatePasswordField = () => {
  return validateField('password', form.password, validatePassword)
}

// Input event handlers
const handleTcknInput = () => {
  handleInputChange('tckn', form.tcknOrMemberNumber)
}

const handlePasswordInput = () => {
  handleInputChange('password', form.password)
}

// Handle login
const handleLogin = async () => {
  // Clear backend errors
  clearError()

  // Validate form fields
  const isValid = validateForm({
    tckn: validateTcknOrMemberNumberField,
    password: validatePasswordField
  })

  if (!isValid) {
    return
  }

  const result = await login({
    tcknOrMemberNumber: form.tcknOrMemberNumber,
    password: form.password,
    rememberMe: form.rememberMe
  })

  if (result.success) {
    // Clear field errors on success
    clearAllFieldErrors()
    
    // Show success modal and redirect
    handleSuccess(
      'Giriş başarılı! Yönlendiriliyorsunuz...',
      'Hoş Geldiniz!',
      true,
      'Devam Et',
      async () => {
        await navigateTo('/')
      }
    )
    
    // Navigate after a short delay
    setTimeout(async () => {
      await navigateTo('/')
    }, 1500)
  } else {
    // Backend errors - modalda göster
    if (!result.isFieldError) {
      handleBackendError(
        result.error || 'Giriş yapılırken bir hata oluştu. Lütfen bilgilerinizi kontrol edip tekrar deneyin.',
        'Giriş Hatası',
        true,
        handleLogin
      )
    }
  }
}

// Clear backend error messages when form changes
watch([() => form.tcknOrMemberNumber, () => form.password], () => {
  // Sadece backend errors'ları clear et (modal messages)
  clearError()
})
</script>

<style scoped>
.input-group .btn {
  border-left: 0;
}

.input-group .form-control:focus + .btn {
  border-color: #86b7fe;
}

.is-invalid ~ .btn {
  border-color: #dc3545;
}
</style>