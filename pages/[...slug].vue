<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-6 text-center">
        <div class="card">
          <div class="card-body p-5">
            <i class="bi bi-exclamation-triangle fs-1 text-warning mb-3"></i>
            <h1 class="h3 mb-3">Sayfa Bulunamadı</h1>
            <p class="text-muted mb-4">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
            <NuxtLink to="/" class="btn btn-primary">
              <i class="bi bi-house me-2"></i>
              Ana Sayfaya Dön
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Automatically handle Chrome DevTools and other requests
const route = useRoute()

// Don't show 404 for Chrome DevTools requests
if (route.path.includes('.well-known') || route.path.includes('devtools')) {
  // Return empty response for dev tools
  throw createError({
    statusCode: 204,
    statusMessage: 'No Content'
  })
}

useHead({
  title: 'Sayfa Bulunamadı - BetStarter',
  meta: [
    { name: 'description', content: 'Aradığınız sayfa bulunamadı' }
  ]
})
</script> 