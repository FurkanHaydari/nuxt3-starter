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
            <div v-if="errorMessage" class="alert alert-danger" role="alert">
              <i class="bi bi-exclamation-triangle me-2"></i>
              {{ errorMessage }}
            </div>

            <!-- Success Alert -->
            <div v-if="successMessage" class="alert alert-success" role="alert">
              <i class="bi bi-check-circle me-2"></i>
              {{ successMessage }}
            </div>

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
              <div class="mb-3">
                <label for="newPassword" class="form-label">Yeni Şifre *</label>
                <div class="input-group">
                  <input 
                    v-model="form.newPassword"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control" 
                    :class="{ 'is-invalid': passwordError }"
                    id="newPassword" 
                    placeholder="Yeni şifrenizi girin"
                    :disabled="loading"
                    @input="validatePasswordField"
                    @blur="validatePasswordField"
                    required>
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary"
                    @click="showPassword = !showPassword">
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <div v-if="passwordError" class="invalid-feedback">
                  {{ passwordError }}
                </div>
                <div class="form-text">
                  Şifre en az 8 karakter olmalı ve büyük harf, küçük harf, rakam içermelidir.
                </div>
              </div>
              
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Şifre Tekrar *</label>
                <div class="input-group">
                  <input 
                    v-model="form.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="form-control" 
                    :class="{ 'is-invalid': confirmPasswordError }"
                    id="confirmPassword" 
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
              
              <button 
                type="submit" 
                class="btn btn-primary w-100 mb-3"
                :disabled="loading || !isFormValid">
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
const errorMessage = ref('')
const successMessage = ref('')
const isTokenValid = ref(true)
const isSuccess = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Validation errors
const passwordError = ref('')
const confirmPasswordError = ref('')

// Computed properties
const isFormValid = computed(() => {
  return form.newPassword && 
         form.confirmPassword && 
         !passwordError.value && 
         !confirmPasswordError.value
})

// Validation functions
const validatePasswordField = () => {
  if (!form.newPassword) {
    passwordError.value = 'Şifre girilmesi zorunludur.'
    return
  }

  if (form.newPassword.length < 8) {
    passwordError.value = 'Şifre en az 8 karakter olmalıdır.'
    return
  }

  const hasUpperCase = /[A-Z]/.test(form.newPassword)
  const hasLowerCase = /[a-z]/.test(form.newPassword)
  const hasNumbers = /\d/.test(form.newPassword)

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    passwordError.value = 'Şifre büyük harf, küçük harf ve rakam içermelidir.'
    return
  }

  passwordError.value = ''
  
  // Re-validate confirm password if it's filled
  if (form.confirmPassword) {
    validateConfirmPasswordField()
  }
}

const validateConfirmPasswordField = () => {
  if (!form.confirmPassword) {
    confirmPasswordError.value = 'Şifre tekrarı girilmesi zorunludur.'
    return
  }

  if (form.newPassword !== form.confirmPassword) {
    confirmPasswordError.value = 'Şifreler eşleşmiyor.'
    return
  }

  confirmPasswordError.value = ''
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
  errorMessage.value = ''
  successMessage.value = ''
  
  // Final validation
  validatePasswordField()
  validateConfirmPasswordField()
  
  if (!isFormValid.value) {
    return
  }

  loading.value = true

  try {
    const api = useApi()
    
    const response = await api.auth.resetPassword({
      token: token.value,
      newPassword: form.newPassword
    })

    if (response.isSuccess) {
      isSuccess.value = true
      successMessage.value = response.data || 'Şifreniz başarıyla güncellendi'
    } else {
      errorMessage.value = response.error || 'Şifre güncellenirken hata oluştu'
    }
  } catch (error: any) {
    errorMessage.value = error?.message || 'Beklenmeyen bir hata oluştu'
  } finally {
    loading.value = false
  }
}
</script> 