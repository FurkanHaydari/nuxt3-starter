<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <h1 class="mb-4">Yardım</h1>
        <p class="lead">Sık sorulan sorular ve yardım</p>
        
        <div class="accordion" id="helpAccordion">
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                Nasıl üye olabilirim?
              </button>
            </h2>
            <div id="faq1" class="accordion-collapse collapse show" data-bs-parent="#helpAccordion">
              <div class="accordion-body">
                Üye olmak için sağ üst köşedeki "Üye Ol" butonuna tıklayın ve formu doldurun.
              </div>
            </div>
          </div>
          
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                Para yatırma nasıl yapılır?
              </button>
            </h2>
            <div id="faq2" class="accordion-collapse collapse" data-bs-parent="#helpAccordion">
              <div class="accordion-body">
                Hesabınıza giriş yaptıktan sonra "Para Yatır" seçeneğini kullanabilirsiniz.
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
  title: 'Yardım - BetStarter',
  meta: [
    { name: 'description', content: 'BetStarter yardım ve sık sorulan sorular' }
  ]
})
</script> 