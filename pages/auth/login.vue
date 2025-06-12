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
                <label for="tckn" class="form-label">TC Kimlik Numarası</label>
                <input 
                  v-model="form.tckn"
                  type="text" 
                  class="form-control" 
                  id="tckn" 
                  placeholder="TC Kimlik Numarası"
                  maxlength="11"
                  :disabled="loading"
                  required>
              </div>
              
              <div class="mb-3">
                <label for="password" class="form-label">Şifre</label>
                <input 
                  v-model="form.password"
                  type="password" 
                  class="form-control" 
                  id="password"
                  placeholder="Şifrenizi girin"
                  :disabled="loading"
                  required>
              </div>
              
              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="rememberMe">
                <label class="form-check-label" for="rememberMe">
                  Beni hatırla
                </label>
              </div>
              
              <button 
                type="submit" 
                class="btn btn-primary w-100 mb-3"
                :disabled="loading || !form.tckn || !form.password">
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
                  Üye olun
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
const { login, loading, hasError, error, clearError } = useAuth()

// Reactive form data
const form = reactive({
  tckn: '',
  password: ''
})

// Local state
const errorMessage = ref('')
const successMessage = ref('')

// Handle login
const handleLogin = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  clearError()

  const result = await login({
    tckn: form.tckn,
    password: form.password
  })

  if (result.success) {
    successMessage.value = 'Giriş başarılı! Yönlendiriliyorsunuz...'
    
    // Redirect to dashboard or home
    setTimeout(() => {
      navigateTo('/')
    }, 1500)
  } else {
    errorMessage.value = result.error || 'Giriş yapılırken bir hata oluştu'
  }
}

// Clear messages when form changes
watch([() => form.tckn, () => form.password], () => {
  errorMessage.value = ''
  successMessage.value = ''
  clearError()
})
</script>