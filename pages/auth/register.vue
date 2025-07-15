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
              @validation-error="handleValidationErrors"
            />

            <!-- Step 2: SMS OTP Verification -->
            <OtpForm 
              v-else-if="currentStep === 2"
              :otp-form="otpForm"
              :masked-phone="maskedPhone"
              :resend-countdown="resendCountdown"
              :loading="loading"
              :otp-error="otpError"
              @submit="verifyOtp"
              @resend="resendOtp"
              @back="goBackToForm"
            />

            <!-- Error Alert - Removed since backend errors now go to modal -->
            
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
const { registerRequest, verifyRegistration, loading, clearError } = useAuth()
const { showError, showSuccess, setLastAction } = useNotifications()
const { 
  getFieldError,
  setFieldError,
  clearFieldError,
  handleBackendError, 
  handleSuccess 
} = useErrorHandling()

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

// Computed
const otpError = computed(() => getFieldError('otpCode'))

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
const handleValidationErrors = (errors: string[]) => {
  // Show frontend validation errors in alert
  showError('Lütfen tüm alanları doğru şekilde doldurun', 'Form Hatası', errors)
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
  } else {
    // Handle backend errors - all backend errors now go to modal
    const errorMessage = result.error || 'Kayıt işlemi sırasında bir hata oluştu'
    console.log('Backend error for modal:', errorMessage)
    
    // Always show backend errors in modal
    handleBackendError(
      errorMessage,
      'Kayıt Hatası',
      true,
      submitRegistration
    )
  }
}

const verifyOtp = async () => {
  if (!otpForm.otpCode.trim()) {
    setFieldError('otpCode', 'Doğrulama kodu girilmesi zorunludur')
    return
  }

  if (!/^\d{4}$/.test(otpForm.otpCode)) {
    setFieldError('otpCode', 'Doğrulama kodu 4 haneli olmalıdır')
    return
  }

  clearError()
  clearFieldError('otpCode')
  
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
      handleSuccess(
        'Hesabınız oluşturuldu ve giriş yaptınız!',
        'Hoş Geldiniz',
        true,
        'Dashboard\'a Git',
        async () => {
          await navigateTo('/dashboard')
        }
      )
      // Redirect to dashboard after a short delay
      setTimeout(async () => {
        await navigateTo('/dashboard')
      }, 2000)
    } else {
      // If auto-login fails, show success and redirect to login
      handleSuccess(
        'Hesabınız başarıyla oluşturuldu!',
        'Üyelik Tamamlandı',
        true,
        'Giriş Yap',
        async () => {
          await navigateTo('/auth/login')
        }
      )
    }
  } else {
    // Handle backend errors - all backend errors now go to modal
    const errorMessage = result.error || 'Doğrulama işlemi sırasında bir hata oluştu'
    console.log('OTP verification backend error for modal:', errorMessage)
    
    // Always show backend errors in modal
    handleBackendError(
      errorMessage,
      'Doğrulama Hatası',
      true,
      verifyOtp
    )
  }
}

const resendOtp = async () => {
  clearError()
  clearFieldError('otpCode') // Clear OTP error before making request
  
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
    handleSuccess(
      'Yeni doğrulama kodu gönderildi',
      'SMS Gönderildi'
    )
  } else {
    // Handle backend errors during resend - all go to modal now
    const errorMessage = result.error || 'SMS gönderimi sırasında bir hata oluştu'
    console.log('Resend OTP backend error for modal:', errorMessage)
    
    handleBackendError(
      errorMessage,
      'SMS Gönderme Hatası',
      true,
      resendOtp
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
  clearFieldError('otpCode')
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