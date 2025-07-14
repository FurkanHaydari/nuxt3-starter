export interface RegistrationData {
  firstName: string
  lastName: string
  tcKimlikNo: string
  birthDate: string
  email: string
  phoneNumber: string
  professionId: string
  password: string
  confirmPassword: string
  marketingConsent: boolean
  electronicCommunicationConsent: boolean
  membershipAgreementConsent: boolean
}

export interface OtpData {
  phoneNumber: string
  otpCode: string
}

export function useRegistration() {
  const { registerRequest, verifyRegistration, loading, error, clearError } = useAuth()
  const { showError, showSuccess, setLastAction } = useNotifications()

  const currentStep = ref(1)
  const resendCountdown = ref(0)
  let resendTimer: NodeJS.Timeout | null = null

  const registrationForm = reactive<RegistrationData>({
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

  const otpForm = reactive<OtpData>({
    phoneNumber: '',
    otpCode: ''
  })

  const maskedPhone = computed(() => {
    if (!registrationForm.phoneNumber) return ''
    const phone = registrationForm.phoneNumber
    if (phone.length >= 10) {
      return phone.substring(0, 6) + '***' + phone.substring(phone.length - 2)
    }
    return phone
  })

  const submitRegistration = async () => {
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
      showError(result.error, 'Kayıt Hatası', true)
    }
  }

  const verifyOtp = async () => {
    setLastAction(verifyOtp)

    const result = await verifyRegistration({
      phoneNumber: otpForm.phoneNumber,
      otpCode: otpForm.otpCode
    })

    if (result.success) {
      currentStep.value = 3
      showSuccess(
        'Hesabınız başarıyla oluşturuldu!',
        'Üyelik Tamamlandı',
        true,
        'Giriş Yap'
      )
    } else if (result.error) {
      showError(result.error, 'Doğrulama Hatası', true)
    }
  }

  const resendOtp = async () => {
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
      showSuccess('Yeni doğrulama kodu gönderildi', 'SMS Gönderildi')
    } else if (result.error) {
      showError(result.error, 'SMS Gönderme Hatası', true)
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
    clearError()
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

  return {
    // State
    currentStep: readonly(currentStep),
    resendCountdown: readonly(resendCountdown),
    registrationForm,
    otpForm,
    maskedPhone,
    loading: readonly(loading),
    error: readonly(error),
    
    // Methods
    submitRegistration,
    verifyOtp,
    resendOtp,
    goBackToForm,
    clearError
  }
}
