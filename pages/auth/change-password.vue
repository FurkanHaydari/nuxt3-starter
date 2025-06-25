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
              <div v-if="errorMessage" class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                {{ errorMessage }}
              </div>

              <!-- Success State -->
              <div v-if="isSuccess" class="text-center">
                <div class="mb-4">
                  <i class="bi bi-check-circle-fill text-success" style="font-size: 3rem;"></i>
                </div>
                <h4 class="text-success mb-3">{{ successMessage }}</h4>
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
                    :class="{ 'is-invalid': tcKimlikError }"
                    id="tcKimlikNo" 
                    placeholder="TC Kimlik numaranızı girin"
                    maxlength="11"
                    :disabled="loading"
                    @input="validateTcKimlikField"
                    @blur="validateTcKimlikField"
                    required>
                  <div v-if="tcKimlikError" class="invalid-feedback">
                    {{ tcKimlikError }}
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
                      :class="{ 'is-invalid': currentPasswordError }"
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
                  <div v-if="currentPasswordError" class="invalid-feedback">
                    {{ currentPasswordError }}
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
                      :class="{ 'is-invalid': newPasswordError }"
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
                  <div v-if="newPasswordError" class="invalid-feedback">
                    {{ newPasswordError }}
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
                      :class="{ 'is-invalid': confirmPasswordError }"
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
                  <div v-if="confirmPasswordError" class="invalid-feedback">
                    {{ confirmPasswordError }}
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

// Form data
const form = reactive({
  tcKimlikNo: '',
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
})

// State
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const isSuccess = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Validation errors
const tcKimlikError = ref('')
const currentPasswordError = ref('')
const newPasswordError = ref('')
const confirmPasswordError = ref('')

// Computed properties
const isFormValid = computed(() => {
  return form.tcKimlikNo && 
         form.currentPassword &&
         form.newPassword && 
         form.confirmNewPassword &&
         !tcKimlikError.value && 
         !currentPasswordError.value &&
         !newPasswordError.value && 
         !confirmPasswordError.value
})

// Validation functions
const validateTcKimlikField = () => {
  if (!form.tcKimlikNo) {
    tcKimlikError.value = 'TC Kimlik No girilmesi zorunludur.'
    return
  }

  if (form.tcKimlikNo.length < 11) {
    tcKimlikError.value = 'TC Kimlik No alanına en az 11 karakter girilmelidir.'
    return
  }

  if (form.tcKimlikNo.length !== 11 || !/^\d{11}$/.test(form.tcKimlikNo)) {
    tcKimlikError.value = 'TC Kimlik numaranızı tekrar kontrol edin.'
    return
  }

  // TCKN algorithm validation
  if (!validateTCKN(form.tcKimlikNo)) {
    tcKimlikError.value = 'TC Kimlik numaranızı tekrar kontrol edin.'
    return
  }

  tcKimlikError.value = ''
}

const validateCurrentPasswordField = () => {
  if (!form.currentPassword) {
    currentPasswordError.value = 'Mevcut şifre gereklidir.'
    return
  }

  if (form.currentPassword.length < 8) {
    currentPasswordError.value = 'Şifre en az 8 karakter olmalıdır.'
    return
  }

  currentPasswordError.value = ''
}

const validateNewPasswordField = () => {
  if (!form.newPassword) {
    newPasswordError.value = 'Yeni şifre gereklidir.'
    return
  }

  if (form.newPassword.length < 8) {
    newPasswordError.value = 'Geçersiz şifre.'
    return
  }

  if (form.newPassword === form.currentPassword) {
    newPasswordError.value = 'Yeni şifre mevcut şifreden farklı olmalıdır.'
    return
  }

  const hasUpperCase = /[A-Z]/.test(form.newPassword)
  const hasLowerCase = /[a-z]/.test(form.newPassword)
  const hasNumbers = /\d/.test(form.newPassword)
  const hasSpecialChar = /[!@#$%^&*()_+\[\]{}|;:,.?"'<>-]/.test(form.newPassword)

  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    newPasswordError.value = 'Geçersiz şifre.'
    return
  }

  // Check for sequential numbers, repeating characters, personal info
  if (hasSequentialNumbers(form.newPassword) || hasRepeatingChars(form.newPassword)) {
    newPasswordError.value = 'Geçersiz şifre.'
    return
  }

  newPasswordError.value = ''
  
  // Re-validate confirm password if it's filled
  if (form.confirmNewPassword) {
    validateConfirmPasswordField()
  }
}

const validateConfirmPasswordField = () => {
  if (!form.confirmNewPassword) {
    confirmPasswordError.value = 'Şifre tekrarı gereklidir.'
    return
  }

  if (form.newPassword !== form.confirmNewPassword) {
    confirmPasswordError.value = 'Lütfen aynı şifreleri giriniz.'
    return
  }

  confirmPasswordError.value = ''
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
  errorMessage.value = ''
  successMessage.value = ''
  
  // Final validation
  validateTcKimlikField()
  validateCurrentPasswordField()
  validateNewPasswordField()
  validateConfirmPasswordField()
  
  if (!isFormValid.value) {
    return
  }

  loading.value = true

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
      successMessage.value = response.data || 'Şifreniz başarılı bir şekilde değiştirilmiştir.'
    } else {
      errorMessage.value = response.error || 'Şifre güncellenirken hata oluştu'
    }
  } catch (error: any) {
    errorMessage.value = error?.message || 'Beklenmeyen bir hata oluştu'
  } finally {
    loading.value = false
  }
}

// Auto login after password change
const loginWithNewPassword = async () => {
  loading.value = true
  
  try {
    const { login } = useAuth()
    
    await login({
      tcknOrMemberNumber: form.tcKimlikNo,
      password: form.newPassword
    })
    
    // Redirect to home page
    await navigateTo('/')
  } catch (error: any) {
    errorMessage.value = 'Otomatik giriş başarısız. Lütfen manuel giriş yapın.'
  } finally {
    loading.value = false
  }
}
</script> 