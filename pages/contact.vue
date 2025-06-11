<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <h1 class="mb-4">İletişim</h1>
        <p class="lead">Bizimle iletişime geçin</p>
        
        <div class="row">
          <div class="col-md-6">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">
                  <i class="bi bi-envelope me-2"></i>
                  E-posta
                </h5>
                <p class="card-text">info@betstarter.com</p>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">
                  <i class="bi bi-phone me-2"></i>
                  Telefon
                </h5>
                <p class="card-text">+90 (212) 555 0123</p>
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
  title: 'İletişim - BetStarter',
  meta: [
    { name: 'description', content: 'BetStarter ile iletişime geçin' }
  ]
})
</script> 