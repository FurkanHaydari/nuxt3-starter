<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-body p-4">
            <div class="text-center mb-4">
              <h2 class="h4 fw-bold">Şifre Sıfırlama</h2>
              <p class="text-muted">E-posta adresinizi girin</p>
            </div>
            
            <form>
              <div class="mb-3">
                <label for="email" class="form-label">E-posta Adresi</label>
                <input type="email" class="form-control" id="email" required>
              </div>
              
              <button type="submit" class="btn btn-primary w-100 mb-3">
                Sıfırlama Linki Gönder
              </button>
              
              <div class="text-center">
                <NuxtLink to="/auth/login" class="text-decoration-none">
                  Giriş sayfasına dön
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
useHead({
  title: 'Şifre Sıfırlama - BetStarter',
  meta: [
    { name: 'description', content: 'Şifrenizi sıfırlayın' }
  ]
})
</script> 