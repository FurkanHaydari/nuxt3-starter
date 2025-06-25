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
            
            <!-- Error Alert -->
            <div v-if="hasError || errorMessage" class="alert alert-danger" role="alert">
              <i class="bi bi-exclamation-triangle me-2"></i>
              {{ error || errorMessage }}
            </div>

            <!-- Success Alert -->
            <div v-if="successMessage" class="alert alert-success" role="alert">
              <i class="bi bi-check-circle me-2"></i>
              {{ successMessage }}
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
                  @input="validateTcknOrMemberNumberField"
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
                    @input="validatePasswordField"
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
  hasError, 
  error, 
  clearError, 
  validateTckn, 
  validatePassword,
  getRememberedCredentials 
} = useAuth()

// Reactive form data
const form = reactive({
  tcknOrMemberNumber: '',
  password: '',
  rememberMe: false
})

// Local state
const errorMessage = ref('')
const successMessage = ref('')
const showPassword = ref(false)
const tcknError = ref('')
const passwordError = ref('')

// Form validation
const isFormValid = computed(() => {
  return form.tcknOrMemberNumber && 
         form.password && 
         !tcknError.value && 
         !passwordError.value
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
  const validation = validateTckn(form.tcknOrMemberNumber)
  tcknError.value = validation.isValid ? '' : validation.error || ''
}

const validatePasswordField = () => {
  const validation = validatePassword(form.password)
  passwordError.value = validation.isValid ? '' : validation.error || ''
}

// Handle login
const handleLogin = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  clearError()

  // Final validation before submit
  validateTcknOrMemberNumberField()
  validatePasswordField()

  if (!isFormValid.value) {
    return
  }

  const result = await login({
    tcknOrMemberNumber: form.tcknOrMemberNumber,
    password: form.password,
    rememberMe: form.rememberMe
  })

  if (result.success) {
    // Redirect directly to dashboard or home
    await navigateTo('/')
  } else {
    errorMessage.value = result.error || 'Giriş yapılırken bir hata oluştu'
  }
}

// Clear messages and field errors when form changes
watch([() => form.tcknOrMemberNumber, () => form.password], () => {
  errorMessage.value = ''
  successMessage.value = ''
  clearError()
  
  // Clear field errors when user starts typing
  if (tcknError.value && form.tcknOrMemberNumber) {
    tcknError.value = ''
  }
  if (passwordError.value && form.password) {
    passwordError.value = ''
  }
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