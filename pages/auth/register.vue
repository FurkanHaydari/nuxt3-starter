<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow">
          <div class="card-body p-4">
            <div class="text-center mb-4">
              <h2 class="h4 fw-bold">Üye Ol</h2>
              <p class="text-muted">BetStarter'a katılın ve kazanmaya başlayın!</p>
            </div>
            
            <form>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="firstName" class="form-label">Ad</label>
                    <input type="text" class="form-control" id="firstName" required>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="lastName" class="form-label">Soyad</label>
                    <input type="text" class="form-control" id="lastName" required>
                  </div>
                </div>
              </div>
              
              <div class="mb-3">
                <label for="email" class="form-label">E-posta Adresi</label>
                <input type="email" class="form-control" id="email" required>
              </div>
              
              <div class="mb-3">
                <label for="phone" class="form-label">Telefon Numarası</label>
                <input type="tel" class="form-control" id="phone" placeholder="+90 (___) ___ ____" required>
              </div>
              
              <div class="mb-3">
                <label for="password" class="form-label">Şifre</label>
                <input type="password" class="form-control" id="password" required>
              </div>
              
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Şifre Tekrar</label>
                <input type="password" class="form-control" id="confirmPassword" required>
              </div>
              
              <div class="mb-3">
                <label for="birthDate" class="form-label">Doğum Tarihi</label>
                <input type="date" class="form-control" id="birthDate" required>
              </div>
              
              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="termsCheck" required>
                <label class="form-check-label" for="termsCheck">
                  <a href="#" class="text-decoration-none">Kullanım Şartları</a> ve 
                  <a href="#" class="text-decoration-none">Gizlilik Politikası</a>'nı kabul ediyorum
                </label>
              </div>
              
              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="ageCheck" required>
                <label class="form-check-label" for="ageCheck">
                  18 yaşından büyük olduğumu beyan ederim
                </label>
              </div>
              
              <button type="submit" class="btn btn-primary w-100 mb-3">
                <i class="bi bi-person-plus me-2"></i>
                Üye Ol
              </button>
              
              <div class="text-center">
                <span class="text-muted">Zaten hesabınız var mı? </span>
                <NuxtLink to="/auth/login" class="text-decoration-none">
                  Giriş yapın
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
  title: 'Üye Ol - BetStarter',
  meta: [
    { name: 'description', content: 'BetStarter\'a üye olun ve kazanmaya başlayın!' }
  ]
})
</script>