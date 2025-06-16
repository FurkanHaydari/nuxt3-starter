<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-body p-4 text-center">
            <div class="mb-4">
              <i class="bi bi-exclamation-triangle-fill text-warning" style="font-size: 4rem;"></i>
            </div>
            
            <h2 class="h4 fw-bold mb-3">{{ error.statusCode }}</h2>
            <h3 class="h5 text-muted mb-4">{{ error.statusMessage }}</h3>
            
            <div v-if="error.statusCode === 404">
              <p class="mb-4">Aradığınız sayfa bulunamadı.</p>
              <NuxtLink to="/" class="btn btn-primary w-100 mb-3">
                <i class="bi bi-house me-2"></i>
                Ana Sayfaya Dön
              </NuxtLink>
            </div>
            
            <div v-else-if="error.statusCode === 400">
              <p class="mb-4">
                Şifre sıfırlama linki geçersiz veya eksik. 
                Lütfen yeni bir şifre sıfırlama talebinde bulunun.
              </p>
              <NuxtLink to="/auth/forgot-password" class="btn btn-primary w-100 mb-3">
                <i class="bi bi-key me-2"></i>
                Şifre Sıfırlama
              </NuxtLink>
            </div>
            
            <div v-else>
              <p class="mb-4">Beklenmeyen bir hata oluştu.</p>
              <button @click="handleError" class="btn btn-primary w-100 mb-3">
                <i class="bi bi-arrow-clockwise me-2"></i>
                Tekrar Dene
              </button>
            </div>
            
            <NuxtLink to="/auth/login" class="text-decoration-none">
              <i class="bi bi-arrow-left me-1"></i>
              Giriş sayfasına dön
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface NuxtError {
  statusCode: number
  statusMessage: string
}

const props = defineProps<{
  error: NuxtError
}>()

useHead({
  title: `Hata ${props.error.statusCode} - BetStarter`,
  meta: [
    { name: 'description', content: 'Bir hata oluştu' }
  ]
})

const handleError = () => clearError({ redirect: '/' })
</script>
