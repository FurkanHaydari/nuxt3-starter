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
            
            <form>
              <div class="mb-3">
                <label for="email" class="form-label">E-posta Adresi</label>
                <input type="email" class="form-control" id="email" placeholder="ornek@email.com" required>
              </div>
              
              <div class="mb-3">
                <label for="password" class="form-label">Şifre</label>
                <input type="password" class="form-control" id="password" required>
              </div>
              
              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="rememberMe">
                <label class="form-check-label" for="rememberMe">
                  Beni hatırla
                </label>
              </div>
              
              <button type="submit" class="btn btn-primary w-100 mb-3">
                <i class="bi bi-box-arrow-in-right me-2"></i>
                Giriş Yap
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
useHead({
  title: 'Giriş Yap - BetStarter',
  meta: [
    { name: 'description', content: 'BetStarter hesabınıza giriş yapın' }
  ]
})
</script>