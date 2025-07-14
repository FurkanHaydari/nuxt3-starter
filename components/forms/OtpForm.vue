<template>
  <div class="text-center mb-4">
    <i class="bi bi-phone text-primary" style="font-size: 3rem;"></i>
    <h4 class="mt-3">SMS Doğrulama</h4>
    <p class="text-muted">
      <strong>{{ maskedPhone }}</strong> numarasına gönderilen 4 haneli kodu giriniz.
    </p>
  </div>

  <form @submit.prevent="handleSubmit">
    <div class="mb-3">
      <label for="otpCode" class="form-label text-center d-block">Doğrulama Kodu</label>
      <div class="d-flex justify-content-center">
        <input 
          type="text" 
          class="form-control text-center" 
          id="otpCode" 
          v-model="otpForm.otpCode"
          :class="{ 'is-invalid': props.otpError }"
          placeholder="1234"
          maxlength="4"
          style="max-width: 200px; font-size: 1.5rem; letter-spacing: 0.5rem;"
          required>
      </div>
      <div v-if="props.otpError" class="invalid-feedback text-center d-block">{{ props.otpError }}</div>
    </div>

    <div class="text-center mb-3">
      <small class="text-muted">
        Kod gelmediyse <span v-if="resendCountdown > 0">{{ resendCountdown }} saniye</span>
        <button 
          v-else
          type="button" 
          class="btn btn-link p-0 text-decoration-none"
          @click="$emit('resend')"
          :disabled="loading">
          tekrar gönder
        </button>
      </small>
    </div>

    <button type="submit" class="btn btn-success w-100 mb-3" :disabled="loading">
      <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
      <i v-else class="bi bi-check-circle me-2"></i>
      Üyeliği Tamamla
    </button>

    <button type="button" class="btn btn-outline-secondary w-100" @click="$emit('back')">
      <i class="bi bi-arrow-left me-2"></i>
      Geri Dön
    </button>
  </form>
</template>

<script setup lang="ts">
interface Props {
  otpForm: {
    phoneNumber: string
    otpCode: string
  }
  maskedPhone: string
  resendCountdown: number
  loading: boolean
  otpError?: string
}

interface Emits {
  (e: 'submit'): void
  (e: 'resend'): void
  (e: 'back'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleSubmit = () => {
  if (!props.otpForm.otpCode.trim()) {
    return
  }

  emit('submit')
}
</script>
