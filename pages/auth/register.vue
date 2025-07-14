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

            <!-- Step 1: Registration Form -->
            <RegistrationForm 
              v-if="currentStep === 1"
              :form="registrationForm"
              :loading="loading"
              @submit="submitRegistration"
            />

            <!-- Step 2: SMS OTP Verification -->
            <OtpForm 
              v-else-if="currentStep === 2"
              :otp-form="otpForm"
              :masked-phone="maskedPhone"
              :resend-countdown="resendCountdown"
              :loading="loading"
              :otp-error="errors.otpCode"
              @submit="verifyOtp"
              @resend="resendOtp"
              @back="goBackToForm"
            />

            <!-- Error Alert -->
            <div v-if="error" class="alert alert-danger mt-3">
              <i class="bi bi-exclamation-triangle me-2"></i>
              {{ error }}
            </div>

            <!-- Login Link -->
            <div v-if="currentStep === 1" class="text-center mt-3">
              <span class="text-muted">Zaten hesabınız var mı? </span>
              <NuxtLink to="/auth/login" class="text-decoration-none">
                Giriş yapın
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Error Modal -->
  <ErrorModal 
    :show="showErrorModal"
    :title="errorModal.title"
    :message="errorModal.message"
    :show-retry="errorModal.showRetry"
    @close="closeErrorModal"
    @retry="retryLastAction"
  />

  <!-- Success Modal -->
  <SuccessModal 
    :show="showSuccessModal"
    :title="successModal.title"
    :message="successModal.message"
    :show-action="successModal.showAction"
    :action-text="successModal.actionText"
    @close="closeSuccessModal"
    @action="() => navigateTo('/dashboard')"
  />
</template>

<script setup lang="ts">
// Component imports
import RegistrationForm from '~/components/forms/RegistrationForm.vue'
import OtpForm from '~/components/forms/OtpForm.vue'

useHead({
  title: 'Üye Ol - BetStarter',
  meta: [
    { name: 'description', content: 'BetStarter\'a üye olun ve kazanmaya başlayın!' }
  ]
})

// Composables
const { registerRequest, verifyRegistration, loading, error, clearError } = useAuth()
const { showError, showSuccess, showErrorModal, showSuccessModal, errorModal, successModal, closeErrorModal, closeSuccessModal, setLastAction, retryLastAction } = useNotifications()

// Data
const currentStep = ref(1)
const resendCountdown = ref(0)
let resendTimer: NodeJS.Timeout | null = null

// Forms
const registrationForm = reactive({
  firstName: '',
  lastName: '',
  tcKimlikNo: '',
  birthDate: '',
  email: '',
  phoneNumber: '',
  professionId: '',
  password: '',
  confirmPassword: '',
  marketingConsent: false,
  electronicCommunicationConsent: false,
  membershipAgreementConsent: false
})

const otpForm = reactive({
  phoneNumber: '',
  otpCode: ''
})

// Errors (only for OTP, registration form errors handled by component)
const errors = reactive({
  otpCode: ''
})

// Computed
const maskedPhone = computed(() => {
  if (!registrationForm.phoneNumber) return ''
  const phone = registrationForm.phoneNumber
  if (phone.length >= 10) {
    return phone.substring(0, 6) + '***' + phone.substring(phone.length - 2)
  }
  return phone
})

// Methods
const clearErrors = () => {
  errors.otpCode = ''
}

const submitRegistration = async () => {
  clearError()
  
  // Set up last action for retry functionality
  setLastAction(submitRegistration)
  
  const result = await registerRequest({
    firstName: registrationForm.firstName,
    lastName: registrationForm.lastName,
    tckn: registrationForm.tcKimlikNo,
    birthDate: registrationForm.birthDate,
    email: registrationForm.email,
    phoneNumber: registrationForm.phoneNumber,
    professionId: parseInt(registrationForm.professionId),
    password: registrationForm.password,
    marketingConsent: registrationForm.marketingConsent,
    electronicCommunicationConsent: registrationForm.electronicCommunicationConsent,
    membershipAgreementConsent: registrationForm.membershipAgreementConsent
  })

  if (result.success) {
    otpForm.phoneNumber = registrationForm.phoneNumber
    currentStep.value = 2
    startResendCountdown()
  } else if (result.error) {
    // Handle backend errors - all backend errors now go to modal
    showError(
      result.error,
      'Kayıt Hatası',
      undefined,
      true // Show retry button
    )
  }
}

const verifyOtp = async () => {
  if (!otpForm.otpCode.trim()) {
    errors.otpCode = 'Doğrulama kodu girilmesi zorunludur'
    return
  }

  if (!/^\d{4}$/.test(otpForm.otpCode)) {
    errors.otpCode = 'Doğrulama kodu 4 haneli olmalıdır'
    return
  }

  clearError()
  errors.otpCode = ''
  
  setLastAction(verifyOtp)

  const result = await verifyRegistration({
    phoneNumber: otpForm.phoneNumber,
    otpCode: otpForm.otpCode
  })

  if (result.success) {
    // Auto-login after successful registration
    const { login } = useAuth()
    const loginResult = await login({
      phoneNumber: otpForm.phoneNumber,
      password: registrationForm.password
    })
    
    if (loginResult.success) {
      showSuccess(
        'Hesabınız oluşturuldu ve giriş yaptınız!',
        'Hoş Geldiniz',
        true,
        'Dashboard\'a Git'
      )
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigateTo('/dashboard')
      }, 2000)
    } else {
      // If auto-login fails, show success and redirect to login
      showSuccess(
        'Hesabınız başarıyla oluşturuldu!',
        'Üyelik Tamamlandı',
        true,
        'Giriş Yap'
      )
    }
  } else if (result.error) {
    // Backend errors'ları sadece modal'da göster
    if (!result.isFieldError) {
      showError(
        result.error,
        'Doğrulama Hatası',
        undefined,
        true // Show retry button
      )
    } else {
      // Field error'sa OTP field'ına yaz
      errors.otpCode = result.error
    }
  }
}

const resendOtp = async () => {
  clearError()
  clearErrors() // Clear OTP error before making request
  
  setLastAction(resendOtp)
  
  const result = await registerRequest({
    firstName: registrationForm.firstName,
    lastName: registrationForm.lastName,
    tckn: registrationForm.tcKimlikNo,
    birthDate: registrationForm.birthDate,
    email: registrationForm.email,
    phoneNumber: registrationForm.phoneNumber,
    professionId: parseInt(registrationForm.professionId),
    password: registrationForm.password,
    marketingConsent: registrationForm.marketingConsent,
    electronicCommunicationConsent: registrationForm.electronicCommunicationConsent,
    membershipAgreementConsent: registrationForm.membershipAgreementConsent
  })

  if (result.success) {
    startResendCountdown()
    showSuccess(
      'Yeni doğrulama kodu gönderildi',
      'SMS Gönderildi'
    )
  } else if (result.error) {
    // Handle backend errors during resend - all go to modal now
    showError(
      result.error,
      'SMS Gönderme Hatası',
      undefined,
      true // Show retry button
    )
  }
}

const startResendCountdown = () => {
  resendCountdown.value = 60
  resendTimer = setInterval(() => {
    resendCountdown.value--
    if (resendCountdown.value <= 0) {
      clearInterval(resendTimer!)
      resendTimer = null
    }
  }, 1000)
}

const goBackToForm = () => {
  currentStep.value = 1
  otpForm.otpCode = ''
  errors.otpCode = ''
  if (resendTimer) {
    clearInterval(resendTimer)
    resendTimer = null
  }
}

// Cleanup
onUnmounted(() => {
  if (resendTimer) {
    clearInterval(resendTimer)
  }
})
</script>