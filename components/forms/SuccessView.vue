<template>
  <div class="text-center">
    <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
    <h4 class="mt-3 text-success">Üyelik Tamamlandı!</h4>
    <p class="text-muted mb-4">
      Hesabınız başarıyla oluşturuldu. Artık giriş yapabilirsiniz.
    </p>
    <NuxtLink to="/auth/login" class="btn btn-primary">
      <i class="bi bi-box-arrow-in-right me-2"></i>
      Giriş Yap
    </NuxtLink>
  </div>
</template>
