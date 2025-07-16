<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-body p-4">
            <div class="text-center mb-4">
              <h2 class="h4 fw-bold">Yeni Şifre Belirle</h2>
              <p class="text-muted">Hesabınız için yeni bir şifre belirleyin</p>
            </div>
            
            <!-- Error Alert -->
            <!-- Error messages now shown in global modal -->

            <!-- Success Alert -->
            <!-- Success messages now shown in global modal -->

            <!-- Token Invalid/Expired -->
            <div v-if="!isTokenValid" class="text-center">
              <div class="mb-4">
                <i class="bi bi-exclamation-triangle-fill text-warning" style="font-size: 3rem;"></i>
              </div>
              <h4 class="text-warning mb-3">Geçersiz veya Süresi Dolmuş Link</h4>
              <p class="mb-4">
                Bu şifre sıfırlama linki geçersiz veya süresi dolmuş. 
                Lütfen yeni bir şifre sıfırlama talebinde bulunun.
              </p>
              <NuxtLink to="/auth/forgot-password" class="btn btn-primary w-100 mb-3">
                <i class="bi bi-arrow-left me-2"></i>
                Şifre Sıfırlama Sayfasına Dön
              </NuxtLink>
            </div>

            <!-- Reset Form -->
            <form v-else-if="!isSuccess" @submit.prevent="handleSubmit">
              <!-- New Password Field -->
              <FormPasswordField
                v-model="form.newPassword"
                field-id="newPassword"
                label="Yeni Şifre"
                placeholder="Yeni şifrenizi girin"
                :disabled="loading"
                :error-message="getFieldError('newPassword')"
                :require-special-char="true"
                :min-strength-score="3"
                @input="onPasswordInput"
                @blur="validatePasswordField"
                @validation-change="onPasswordValidationChange"
              />
              
              <!-- Confirm Password Field -->
              <FormPasswordField
                v-model="form.confirmPassword"
                field-id="confirmPassword"
                label="Şifre Tekrar"
                placeholder="Şifrenizi tekrar girin"
                :disabled="loading"
                :error-message="getFieldError('confirmPassword')"
                :show-strength-indicator="false"
                :show-requirements="false"
                :require-special-char="true"
                :min-strength-score="3"
                @input="onConfirmPasswordInput"
                @blur="validateConfirmPasswordField"
              />
              
              <!-- Enhanced password match indicator -->
              <div v-if="form.confirmPassword" class="mt-2 mb-3">
                <div v-if="form.newPassword === form.confirmPassword" class="d-flex align-items-center">
                  <i class="bi bi-check-circle text-success me-2"></i>
                  <small class="text-success fw-medium">Şifreler eşleşiyor</small>
                </div>
                <div v-else class="d-flex align-items-center">
                  <i class="bi bi-x-circle text-danger me-2"></i>
                  <small class="text-danger fw-medium">Şifreler eşleşmiyor</small>
                </div>
              </div>
              
              <button 
                type="submit" 
                class="btn btn-primary w-100 mb-3"
                :disabled="loading || !isFormValid || passwordsMismatch || !passwordValidation.isValid">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <i v-else class="bi bi-check me-2"></i>
                {{ loading ? 'Şifre güncelleniyor...' : 'Şifreyi Güncelle' }}
              </button>
            </form>

            <!-- Success State -->
            <div v-else class="text-center">
              <div class="mb-4">
                <i class="bi bi-check-circle-fill text-success" style="font-size: 3rem;"></i>
              </div>
              <h4 class="text-success mb-3">Şifreniz Başarıyla Güncellendi</h4>
              <p class="mb-4">
                Şifreniz başarıyla güncellendi. Artık yeni şifrenizle giriş yapabilirsiniz.
              </p>
              <NuxtLink to="/auth/login" class="btn btn-primary w-100 mb-3">
                <i class="bi bi-box-arrow-in-right me-2"></i>
                Giriş Yap
              </NuxtLink>
            </div>
            
            <div class="text-center mt-3">
              <NuxtLink to="/auth/login" class="text-decoration-none">
                <i class="bi bi-arrow-left me-1"></i>
                Giriş sayfasına dön
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Middleware ile token kontrolü
definePageMeta({
  middleware: 'reset-password'
})

useHead({
  title: 'Yeni Şifre Belirle - BetStarter',
  meta: [
    { name: 'description', content: 'Hesabınız için yeni şifre belirleyin' }
  ]
})

// Composables
const { showError, showSuccess, setLastAction } = useNotifications()
const {
  hasFieldErrors,
  getFieldError,
  setFieldError,
  clearFieldError,
  validateField,
  validateForm,
  handleInputChange,
  handleBackendError,
  handleSuccess,
  clearAllFieldErrors,
  scrollToFirstError
} = useErrorHandling()

// Get token from URL
const route = useRoute()
const token = computed(() => route.query.token as string)

// Form data
const form = reactive({
  newPassword: '',
  confirmPassword: ''
})

// State
const loading = ref(false)
const isTokenValid = ref(true)
const isSuccess = ref(false)

// Password validation state from PasswordField component
const passwordValidation = ref({
  isValid: false,
  score: 0,
  requirements: {},
  strength: {}
})

// Computed properties
const isFormValid = computed(() => {
  return form.newPassword && 
         form.confirmPassword && 
         !getFieldError('newPassword') && 
         !getFieldError('confirmPassword')
})

const passwordsMismatch = computed(() => {
  return form.newPassword && form.confirmPassword && form.newPassword !== form.confirmPassword
})

// Password validation handled by FormPasswordField component
const validatePasswordField = () => {
  // FormPasswordField handles complex password validation
  // Only check if field is empty for basic validation
  if (!form.newPassword) {
    setFieldError('newPassword', 'Şifre girilmesi zorunludur.')
  } else {
    clearFieldError('newPassword')
  }
  
  // Re-validate confirm password if it's filled
  if (form.confirmPassword) {
    validateConfirmPasswordField()
  }
}

const validateConfirmPasswordField = () => {
  // Simple password match validation
  if (!form.confirmPassword) {
    setFieldError('confirmPassword', 'Şifre tekrarı girilmesi zorunludur.')
  } else if (form.newPassword !== form.confirmPassword) {
    setFieldError('confirmPassword', 'Şifreler eşleşmiyor.')
  } else {
    clearFieldError('confirmPassword')
  }
}

// Password validation change handler from PasswordField
const onPasswordValidationChange = (data: any) => {
  passwordValidation.value = data
  
  // Also re-validate confirm password if it has been entered
  if (form.confirmPassword) {
    validateConfirmPasswordField()
  }
}

// Realtime validation handlers
const onPasswordInput = () => {
  // Validate password on input
  validatePasswordField()
  
  // Also re-validate confirm password if it has been entered
  if (form.confirmPassword) {
    validateConfirmPasswordField()
  }
}

const onConfirmPasswordInput = () => {
  // Validate confirm password on input (realtime feedback)
  validateConfirmPasswordField()
}

// Check token validity on mount
onMounted(async () => {
  // Token middleware tarafından kontrol edildi, burada backend validation yapabiliriz
  // TODO: Validate token with backend
  // For now, assume token is valid if present
  isTokenValid.value = true
})

// Form submission
const handleSubmit = async () => {
  // Validate all fields
  validatePasswordField()
  validateConfirmPasswordField()
  
  // Form validation check
  if (form.newPassword !== form.confirmPassword) {
    showError('Şifreler eşleşmiyor. Lütfen aynı şifreleri giriniz.', 'Form Hatası')
    return
  }
  
  if (!isFormValid.value) {
    const errors = []
    if (getFieldError('newPassword')) errors.push(getFieldError('newPassword'))
    if (getFieldError('confirmPassword')) errors.push(getFieldError('confirmPassword'))
    
    if (errors.length > 0) {
      showError('Lütfen tüm alanları doğru şekilde doldurun', 'Form Hatası')
      scrollToFirstError()
    }
    return
  }

  loading.value = true
  setLastAction(handleSubmit)

  try {
    const api = useApi()
    
    const response = await api.auth.resetPassword({
      token: token.value,
      newPassword: form.newPassword
    })

    // Check for success message in response
    const isActuallySuccess = response.isSuccess || 
                             (response.data && response.data.includes('başarı')) ||
                             (response.error && response.error.includes('başarı'))
    
    if (isActuallySuccess) {
      isSuccess.value = true
      showSuccess(
        response.data || response.error || 'Şifreniz başarıyla güncellendi',
        'Şifre Güncellendi',
        true,
        'Giriş Yap',
        async () => {
          await navigateTo('/auth/login')
        }
      )
    } else {
      showError(
        response.error || 'Şifre güncellenirken hata oluştu',
        'Şifre Güncelleme Hatası',
        true // Show retry
      )
    }
  } catch (error: any) {
    showError(
      error?.message || 'Beklenmeyen bir hata oluştu',
      'Şifre Güncelleme Hatası',
      true // Show retry
    )
  } finally {
    loading.value = false
  }
}
</script> 