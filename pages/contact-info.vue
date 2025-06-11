<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <h1 class="mb-4">İletişim Bilgileri</h1>
        <div class="row g-4">
          <div class="col-md-6">
            <div class="card h-100">
              <div class="card-body text-center">
                <i class="bi bi-building fs-1 text-primary mb-3"></i>
                <h5>Genel Merkez</h5>
                <p>İstanbul, Türkiye<br>
                Levent Mahallesi<br>
                Büyükdere Caddesi No:123</p>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card h-100">
              <div class="card-body text-center">
                <i class="bi bi-headset fs-1 text-success mb-3"></i>
                <h5>Müşteri Hizmetleri</h5>
                <p>7/24 Destek Hattı<br>
                +90 (212) 555 0123<br>
                support@betstarter.com</p>
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
  title: 'İletişim Bilgileri - BetStarter'
})
</script> 