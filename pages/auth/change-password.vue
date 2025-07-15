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
                <!-- TC Kimlik No -->
                <div class="mb-3">
                  <label for="tcKimlikNo" class="form-label">TC Kimlik No *</label>
                  <input 
                    v-model="form.tcKimlikNo"
                    type="text" 
                    class="form-control" 
                    :class="{ 'is-invalid': getFieldError('tcKimlikNo') }"
                    id="tcKimlikNo" 
                    placeholder="TC Kimlik numaranızı girin"
                    maxlength="11"
                    :disabled="loading"
                    @input="validateTcKimlikField"
                    @blur="validateTcKimlikField"
                    required>
                  <div v-if="getFieldError('tcKimlikNo')" class="invalid-feedback">
                    {{ getFieldError('tcKimlikNo') }}
                  </div>
                </div>

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
                <div class="mb-3">
                  <label for="newPassword" class="form-label">Yeni Şifre *</label>
                  <div class="input-group">
                    <input 
                      v-model="form.newPassword"
                      :type="showNewPassword ? 'text' : 'password'"
                      class="form-control" 
                      :class="{ 'is-invalid': getFieldError('newPassword') }"
                      id="newPassword" 
                      placeholder="Yeni şifrenizi girin"
                      :disabled="loading"
                      @input="validateNewPasswordField"
                      @blur="validateNewPasswordField"
                      required>
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary"
                      @click="showNewPassword = !showNewPassword">
                      <i :class="showNewPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <div v-if="getFieldError('newPassword')" class="invalid-feedback">
                    {{ getFieldError('newPassword') }}
                  </div>
                  <div class="form-text">
                    Şifre en az 8 karakter olmalı ve büyük harf, küçük harf, rakam ve özel karakter içermelidir.
                  </div>
                </div>

                <!-- Yeni Şifre Tekrar -->
                <div class="mb-3">
                  <label for="confirmNewPassword" class="form-label">Yeni Şifre Tekrar *</label>
                  <div class="input-group">
                    <input 
                      v-model="form.confirmNewPassword"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      class="form-control" 
                      :class="{ 'is-invalid': getFieldError('confirmNewPassword') }"
                      id="confirmNewPassword" 
                      placeholder="Şifrenizi tekrar girin"
                      :disabled="loading"
                      @input="validateConfirmPasswordField"
                      @blur="validateConfirmPasswordField"
                      required>
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary"
                      @click="showConfirmPassword = !showConfirmPassword">
                      <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <div v-if="getFieldError('confirmNewPassword')" class="invalid-feedback">
                    {{ getFieldError('confirmNewPassword') }}
                  </div>
                </div>

                <!-- Submit Button -->
                <button 
                  type="submit" 
                  class="btn btn-primary w-100 mb-3"
                  :disabled="loading || !isFormValid">
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
const { validateTckn } = useAuth()
const { showError, showSuccess, setLastAction } = useNotifications()
const {
  hasFieldErrors,
  getFieldError,
  validateField,
  validateForm,
  handleInputChange,
  handleBackendError,
  handleSuccess,
  clearAllFieldErrors,
  scrollToFirstError
} = useErrorHandling()

// Form data
const form = reactive({
  tcKimlikNo: '',
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
})

// State
const loading = ref(false)
const isSuccess = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Computed properties
const isFormValid = computed(() => {
  return form.tcKimlikNo && 
         form.currentPassword &&
         form.newPassword && 
         form.confirmNewPassword &&
         !getFieldError('tcKimlikNo') && 
         !getFieldError('currentPassword') &&
         !getFieldError('newPassword') && 
         !getFieldError('confirmNewPassword')
})

// Validation functions
const validateTcKimlikField = () => {
  let error = null
  
  if (!form.tcKimlikNo) {
    error = 'TC Kimlik No girilmesi zorunludur.'
  } else if (form.tcKimlikNo.length < 11) {
    error = 'TC Kimlik No alanına en az 11 karakter girilmelidir.'
  } else if (form.tcKimlikNo.length !== 11 || !/^\d{11}$/.test(form.tcKimlikNo)) {
    error = 'TC Kimlik numaranızı tekrar kontrol edin.'
  } else if (!validateTCKN(form.tcKimlikNo)) {
    error = 'TC Kimlik numaranızı tekrar kontrol edin.'
  }
  
  handleInputChange('tcKimlikNo', form.tcKimlikNo, error)
}

const validateCurrentPasswordField = () => {
  let error = null
  
  if (!form.currentPassword) {
    error = 'Mevcut şifre gereklidir.'
  } else if (form.currentPassword.length < 8) {
    error = 'Şifre en az 8 karakter olmalıdır.'
  }
  
  handleInputChange('currentPassword', form.currentPassword, error)
}

const validateNewPasswordField = () => {
  let error = null
  
  if (!form.newPassword) {
    error = 'Yeni şifre gereklidir.'
  } else if (form.newPassword.length < 8) {
    error = 'Geçersiz şifre.'
  } else if (form.newPassword === form.currentPassword) {
    error = 'Yeni şifre mevcut şifreden farklı olmalıdır.'
  } else {
    const hasUpperCase = /[A-Z]/.test(form.newPassword)
    const hasLowerCase = /[a-z]/.test(form.newPassword)
    const hasNumbers = /\d/.test(form.newPassword)
    const hasSpecialChar = /[!@#$%^&*()_+\[\]{}|;:,.?"'<>-]/.test(form.newPassword)

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      error = 'Geçersiz şifre.'
    } else if (hasSequentialNumbers(form.newPassword) || hasRepeatingChars(form.newPassword)) {
      error = 'Geçersiz şifre.'
    }
  }
  
  handleInputChange('newPassword', form.newPassword, error)
  
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
  
  handleInputChange('confirmNewPassword', form.confirmNewPassword, error)
}

// Helper functions
const validateTCKN = (tckn: string): boolean => {
  if (tckn.length !== 11 || !/^\d{11}$/.test(tckn)) return false
  
  const digits = tckn.split('').map(Number)
  
  // İlk rakam 0 olamaz
  if (digits[0] === 0) return false
  
  // 10. rakam kontrolü
  const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8]
  const evenSum = digits[1] + digits[3] + digits[5] + digits[7]
  const tenthDigit = ((oddSum * 7) - evenSum) % 10
  
  if (tenthDigit !== digits[9]) return false
  
  // 11. rakam kontrolü
  const sumFirst10 = digits.slice(0, 10).reduce((a, b) => a + b, 0)
  const eleventhDigit = sumFirst10 % 10
  
  return eleventhDigit === digits[10]
}

const hasSequentialNumbers = (password: string): boolean => {
  for (let i = 0; i < password.length - 2; i++) {
    const char1 = password.charCodeAt(i)
    const char2 = password.charCodeAt(i + 1)
    const char3 = password.charCodeAt(i + 2)
    
    if (char2 === char1 + 1 && char3 === char2 + 1) {
      return true
    }
  }
  return false
}

const hasRepeatingChars = (password: string): boolean => {
  for (let i = 0; i < password.length - 2; i++) {
    if (password[i] === password[i + 1] && password[i + 1] === password[i + 2]) {
      return true
    }
  }
  return false
}

// Form submission
const handleSubmit = async () => {
  // Validate all fields
  validateTcKimlikField()
  validateCurrentPasswordField()
  validateNewPasswordField()
  validateConfirmPasswordField()
  
  if (!isFormValid.value) {
    // Show alert for frontend validation errors
    const errors = []
    if (getFieldError('tcKimlikNo')) errors.push(getFieldError('tcKimlikNo'))
    if (getFieldError('currentPassword')) errors.push(getFieldError('currentPassword'))
    if (getFieldError('newPassword')) errors.push(getFieldError('newPassword'))
    if (getFieldError('confirmNewPassword')) errors.push(getFieldError('confirmNewPassword'))
    
    if (errors.length > 0) {
      showError('Lütfen tüm alanları doğru şekilde doldurun', 'Form Hatası', errors)
      scrollToFirstError()
    }
    return
  }

  loading.value = true
  setLastAction(handleSubmit)

  try {
    const api = useApi()
    
    const response = await api.auth.changePassword({
      tcKimlikNo: form.tcKimlikNo,
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
        'Otomatik Giriş Yap',
        loginWithNewPassword
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
    const { login } = useAuth()
    
    const result = await login({
      tcknOrMemberNumber: form.tcKimlikNo,
      password: form.newPassword
    })
    
    if (result.success) {
      showSuccess(
        'Şifre güncellendi ve giriş yapıldı!',
        'Hoş Geldiniz',
        [],
        true,
        'Anasayfa\'ya Git',
        async () => {
          await navigateTo('/')
        }
      )
      // Redirect after delay
      setTimeout(async () => {
        await navigateTo('/')
      }, 2000)
    } else {
      showError(
        'Otomatik giriş başarısız. Lütfen manuel giriş yapın.',
        'Giriş Hatası',
        undefined,
        false,
        'Giriş Sayfasına Git',
        async () => {
          await navigateTo('/auth/login')
        }
      )
    }
  } catch (error: any) {
    showError(
      'Otomatik giriş başarısız. Lütfen manuel giriş yapın.',
      'Giriş Hatası',
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