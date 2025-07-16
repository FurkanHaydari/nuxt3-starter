<template>
  <div class="min-vh-100 d-flex align-items-center bg-light">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow-lg border-0 rounded-3">
            <div class="card-body p-5">
              <!-- Header -->
              <div class="text-center mb-4">
                <h2 class="fw-bold text-primary mb-2">Şifre Güncelle</h2>
                <p class="text-muted">
                  Sistemde kayıtlı şifrenizi güncelleyebilirsiniz
                </p>
              </div>

              <!-- Error Message -->
              <!-- Error messages now shown in global modal -->

              <!-- Success State -->
              <div v-if="isSuccess" class="text-center">
                <div class="mb-4">
                  <i class="bi bi-check-circle-fill text-success" style="font-size: 3rem;"></i>
                </div>
                <h4 class="text-success mb-3">Şifre Başarıyla Güncellendi</h4>
                <p class="mb-4">
                  Şifreniz başarıyla güncellendi. Artık yeni şifrenizle giriş yapabilirsiniz.
                </p>
                <button 
                  @click="loginWithNewPassword"
                  class="btn btn-primary w-100 mb-3"
                  :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i v-else class="bi bi-box-arrow-in-right me-2"></i>
                  {{ loading ? 'Giriş yapılıyor...' : 'Otomatik Giriş Yap' }}
                </button>
                <NuxtLink to="/auth/login" class="btn btn-outline-secondary w-100">
                  <i class="bi bi-arrow-left me-2"></i>
                  Giriş sayfasına dön
                </NuxtLink>
              </div>

              <!-- Form -->
              <form v-else @submit.prevent="handleSubmit">
                <!-- Mevcut Şifre -->
                <div class="mb-3">
                  <label for="currentPassword" class="form-label">Mevcut Şifre *</label>
                  <div class="input-group">
                    <input 
                      v-model="form.currentPassword"
                      :type="showCurrentPassword ? 'text' : 'password'"
                      class="form-control" 
                      :class="{ 'is-invalid': getFieldError('currentPassword') }"
                      id="currentPassword" 
                      placeholder="Mevcut şifrenizi girin"
                      :disabled="loading"
                      @input="validateCurrentPasswordField"
                      @blur="validateCurrentPasswordField"
                      required>
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary"
                      @click="showCurrentPassword = !showCurrentPassword">
                      <i :class="showCurrentPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <div v-if="getFieldError('currentPassword')" class="invalid-feedback">
                    {{ getFieldError('currentPassword') }}
                  </div>
                </div>

                <!-- Yeni Şifre -->
                <FormPasswordField
                  v-model="form.newPassword"
                  field-id="newPassword"
                  label="Yeni Şifre"
                  placeholder="Yeni şifrenizi girin"
                  :disabled="loading"
                  :error-message="getFieldError('newPassword')"
                  :require-special-char="true"
                  :min-strength-score="3"
                  @input="onNewPasswordInput"
                  @blur="validateNewPasswordField"
                  @validation-change="onNewPasswordValidationChange"
                />

                <!-- Yeni Şifre Tekrar -->
                <FormPasswordField
                  v-model="form.confirmNewPassword"
                  field-id="confirmNewPassword"
                  label="Yeni Şifre Tekrar"
                  placeholder="Şifrenizi tekrar girin"
                  :disabled="loading"
                  :error-message="getFieldError('confirmNewPassword')"
                  :show-strength-indicator="false"
                  :show-requirements="false"
                  :require-special-char="true"
                  :min-strength-score="3"
                  @input="onConfirmPasswordInput"
                  @blur="validateConfirmPasswordField"
                />
                
                <!-- Enhanced password match indicator -->
                <div v-if="form.confirmNewPassword" class="mt-2 mb-3">
                  <div v-if="form.newPassword === form.confirmNewPassword" class="d-flex align-items-center">
                    <i class="bi bi-check-circle text-success me-2"></i>
                    <small class="text-success fw-medium">Şifreler eşleşiyor</small>
                  </div>
                  <div v-else class="d-flex align-items-center">
                    <i class="bi bi-x-circle text-danger me-2"></i>
                    <small class="text-danger fw-medium">Şifreler eşleşmiyor</small>
                  </div>
                </div>

                <!-- Submit Button -->
                <button 
                  type="submit" 
                  class="btn btn-primary w-100 mb-3"
                  :disabled="loading || !isFormValid || passwordsMismatch">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i v-else class="bi bi-key me-2"></i>
                  {{ loading ? 'Şifre güncelleniyor...' : 'Şifremi Değiştir' }}
                </button>
              </form>
              
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
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Şifre Güncelle - BetStarter',
  meta: [
    { name: 'description', content: 'Hesabınızın şifresini güncelleyin' }
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

// Form data (TC Kimlik No removed - using JWT token)
const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
})

// State
const loading = ref(false)
const isSuccess = ref(false)
const showCurrentPassword = ref(false)

// Password validation state from PasswordField component
const newPasswordValidation = ref({
  isValid: false,
  score: 0,
  requirements: {},
  strength: {}
})

// Computed properties
const isFormValid = computed(() => {
  return form.currentPassword &&
         form.newPassword && 
         form.confirmNewPassword &&
         !getFieldError('currentPassword') &&
         !getFieldError('newPassword') && 
         !getFieldError('confirmNewPassword')
})

const passwordsMismatch = computed(() => {
  return form.newPassword && form.confirmNewPassword && form.newPassword !== form.confirmNewPassword
})

// Validation functions - simplified with PasswordField
const validateCurrentPasswordField = () => {
  let error = null
  
  if (!form.currentPassword) {
    error = 'Mevcut şifre gereklidir.'
  } else if (form.currentPassword.length < 8) {
    error = 'Şifre en az 8 karakter olmalıdır.'
  }
  
  if (error) {
    setFieldError('currentPassword', error)
  } else {
    clearFieldError('currentPassword')
  }
}

const validateNewPasswordField = () => {
  let error = null
  
  if (!form.newPassword) {
    error = 'Yeni şifre gereklidir.'
  } else if (form.newPassword === form.currentPassword) {
    error = 'Yeni şifre mevcut şifreden farklı olmalıdır.'
  }
  
  if (error) {
    setFieldError('newPassword', error)
  } else {
    clearFieldError('newPassword')
  }
  
  // Re-validate confirm password if it's filled
  if (form.confirmNewPassword) {
    validateConfirmPasswordField()
  }
}

const validateConfirmPasswordField = () => {
  let error = null
  
  if (!form.confirmNewPassword) {
    error = 'Şifre tekrarı gereklidir.'
  } else if (form.newPassword !== form.confirmNewPassword) {
    error = 'Lütfen aynı şifreleri giriniz.'
  }
  
  if (error) {
    setFieldError('confirmNewPassword', error)
  } else {
    clearFieldError('confirmNewPassword')
  }
}

// Password validation change handler from PasswordField
const onNewPasswordValidationChange = (data: any) => {
  newPasswordValidation.value = data
  
  // Also re-validate confirm password if it has been entered
  if (form.confirmNewPassword) {
    validateConfirmPasswordField()
  }
}

// Realtime validation handlers
const onNewPasswordInput = () => {
  // Validate new password on input (realtime feedback)
  validateNewPasswordField()
  
  // Also re-validate confirm password if it has been entered
  if (form.confirmNewPassword) {
    validateConfirmPasswordField()
  }
}

const onConfirmPasswordInput = () => {
  // Validate confirm password on input (realtime feedback)
  validateConfirmPasswordField()
}

// Helper functions removed - FormPasswordField handles validation

// Form submission (JWT token automatically sent, no TC Kimlik needed)
const handleSubmit = async () => {
  // Validate all fields (TC Kimlik validation removed)
  validateCurrentPasswordField()
  validateNewPasswordField()
  validateConfirmPasswordField()
  
  // Form validation check
  if (form.newPassword !== form.confirmNewPassword) {
    showError('Yeni şifreler eşleşmiyor. Lütfen aynı şifreleri giriniz.', 'Form Hatası')
    return
  }
  
  if (!isFormValid.value) {
    const errors = []
    if (getFieldError('currentPassword')) errors.push(getFieldError('currentPassword'))
    if (getFieldError('newPassword')) errors.push(getFieldError('newPassword'))
    if (getFieldError('confirmNewPassword')) errors.push(getFieldError('confirmNewPassword'))
    
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
    
    // JWT token automatically included in API call
    const response = await api.auth.changePassword({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
      confirmNewPassword: form.confirmNewPassword
    })

    if (response.isSuccess) {
      isSuccess.value = true
      showSuccess(
        response.data || 'Şifreniz başarılı bir şekilde değiştirilmiştir.',
        'Şifre Güncellendi',
        [],
        true,
        'Giriş Sayfasına Git',
        () => navigateTo('/auth/login')
      )
    } else {
      showError(
        response.error || 'Şifre güncellenirken hata oluştu',
        'Şifre Güncelleme Hatası',
        undefined,
        true // Show retry
      )
    }
  } catch (error: any) {
    showError(
      error?.message || 'Beklenmeyen bir hata oluştu',
      'Şifre Güncelleme Hatası',
      undefined,
      true // Show retry
    )
  } finally {
    loading.value = false
  }
}

// Auto login after password change
const loginWithNewPassword = async () => {
  loading.value = true
  
  try {
    // Since we don't have TC Kimlik or member number in change password form,
    // just redirect to login page with success message
    showSuccess(
      'Şifreniz başarıyla güncellendi. Lütfen yeni şifrenizle giriş yapın.',
      'Şifre Güncellendi',
      [],
      false,
      'Giriş Sayfasına Git',
      async () => {
        await navigateTo('/auth/login')
      }
    )
    
    // Redirect after delay
    setTimeout(async () => {
      await navigateTo('/auth/login')
    }, 2000)
  } catch (error: any) {
    showError(
      'Lütfen giriş sayfasından yeni şifrenizle giriş yapın.',
      'Giriş Sayfasına Yönlendiriliyor',
      undefined,
      false,
      'Giriş Sayfasına Git',
      async () => {
        await navigateTo('/auth/login')
      }
    )
  } finally {
    loading.value = false
  }
}
</script> 