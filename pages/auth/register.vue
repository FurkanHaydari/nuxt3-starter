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
            <div v-if="currentStep === 1">
              <form @submit.prevent="submitRegistration">
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="firstName" class="form-label">Ad <span class="text-danger">*</span></label>
                      <input 
                        type="text" 
                        class="form-control" 
                        id="firstName" 
                        v-model="registrationForm.firstName"
                        :class="{ 'is-invalid': errors.firstName && hasInteracted.firstName }"
                        @blur="hasInteracted.firstName = true"
                        required>
                      <div v-if="errors.firstName && hasInteracted.firstName" class="invalid-feedback">{{ errors.firstName }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="lastName" class="form-label">Soyad <span class="text-danger">*</span></label>
                      <input 
                        type="text" 
                        class="form-control" 
                        id="lastName" 
                        v-model="registrationForm.lastName"
                        :class="{ 'is-invalid': errors.lastName && hasInteracted.lastName }"
                        @blur="hasInteracted.lastName = true"
                        required>
                      <div v-if="errors.lastName && hasInteracted.lastName" class="invalid-feedback">{{ errors.lastName }}</div>
                    </div>
                  </div>
                </div>
                
                <div class="mb-3">
                  <label for="tcKimlikNo" class="form-label">TC Kimlik No <span class="text-danger">*</span></label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="tcKimlikNo" 
                    v-model="registrationForm.tcKimlikNo"
                    :class="{ 'is-invalid': errors.tcKimlikNo && hasInteracted.tcKimlikNo }"
                    @blur="hasInteracted.tcKimlikNo = true"
                    placeholder="11 haneli TC Kimlik numaranız"
                    maxlength="11"
                    required>
                  <div v-if="errors.tcKimlikNo && hasInteracted.tcKimlikNo" class="invalid-feedback">{{ errors.tcKimlikNo }}</div>
                </div>
                
                <div class="mb-3">
                  <label for="birthDate" class="form-label">Doğum Tarihi <span class="text-danger">*</span></label>
                  <input 
                    type="date" 
                    class="form-control" 
                    id="birthDate" 
                    v-model="registrationForm.birthDate"
                    :class="{ 'is-invalid': errors.birthDate && hasInteracted.birthDate }"
                    @blur="hasInteracted.birthDate = true"
                    required>
                  <div v-if="errors.birthDate && hasInteracted.birthDate" class="invalid-feedback">{{ errors.birthDate }}</div>
                </div>
                
                <div class="mb-3">
                  <label for="email" class="form-label">E-posta Adresi <span class="text-danger">*</span></label>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email" 
                    v-model="registrationForm.email"
                    :class="{ 'is-invalid': errors.email && hasInteracted.email }"
                    @blur="hasInteracted.email = true"
                    required>
                  <div v-if="errors.email && hasInteracted.email" class="invalid-feedback">{{ errors.email }}</div>
                </div>
                
                <div class="mb-3">
                  <label for="phone" class="form-label">Telefon Numarası <span class="text-danger">*</span></label>
                  <input 
                    type="tel" 
                    class="form-control" 
                    id="phone" 
                    v-model="registrationForm.phoneNumber"
                    :class="{ 'is-invalid': errors.phoneNumber && hasInteracted.phoneNumber }"
                    @blur="hasInteracted.phoneNumber = true"
                    placeholder="5XXXXXXXXX veya 5XX XXX XX XX"
                    required>
                  <div v-if="errors.phoneNumber && hasInteracted.phoneNumber" class="invalid-feedback">{{ errors.phoneNumber }}</div>
                </div>
                
                <div class="mb-3">
                  <label for="profession" class="form-label">Meslek <span class="text-danger">*</span></label>
                  <div class="position-relative">
                    <input 
                      type="text" 
                      class="form-control" 
                      id="profession" 
                      v-model="professionSearch"
                      @input="filterProfessions"
                      @focus="showProfessionDropdown = true"
                      @blur="hideProfessionDropdown"
                      :class="{ 'is-invalid': errors.professionId && hasInteracted.professionId }"
                      placeholder="Mesleğinizi arayın..."
                      autocomplete="off"
                      required>
                    
                    <div v-if="showProfessionDropdown && filteredProfessions.length > 0" 
                         class="dropdown-menu show position-absolute w-100" 
                         style="max-height: 200px; overflow-y: auto; z-index: 1050;">
                      <button 
                        v-for="profession in filteredProfessions" 
                        :key="profession.id" 
                        type="button"
                        class="dropdown-item"
                        @mousedown="selectProfession(profession)">
                        {{ profession.name }}
                      </button>
                    </div>
                  </div>
                  <div v-if="errors.professionId && hasInteracted.professionId" class="invalid-feedback d-block">{{ errors.professionId }}</div>
                </div>
                
                <div class="mb-3">
                  <label for="password" class="form-label">Şifre <span class="text-danger">*</span></label>
                  <div class="input-group">
                  <input 
                      :type="showPassword ? 'text' : 'password'" 
                    class="form-control" 
                    id="password" 
                    v-model="registrationForm.password"
                    :class="{ 'is-invalid': errors.password && hasInteracted.password }"
                    @blur="hasInteracted.password = true"
                      placeholder="En az 8 karakter, büyük/küçük harf, rakam ve özel karakter"
                    required>
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary"
                      @click="togglePasswordVisibility"
                      :disabled="loading">
                      <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <div v-if="errors.password && hasInteracted.password" class="invalid-feedback d-block">{{ errors.password }}</div>
                </div>
                
                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Şifre Tekrar <span class="text-danger">*</span></label>
                  <div class="input-group">
                  <input 
                      :type="showConfirmPassword ? 'text' : 'password'" 
                    class="form-control" 
                    id="confirmPassword" 
                    v-model="registrationForm.confirmPassword"
                    :class="{ 'is-invalid': errors.confirmPassword && hasInteracted.confirmPassword }"
                    @blur="hasInteracted.confirmPassword = true"
                      placeholder="Şifrenizi tekrar girin"
                    required>
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary"
                      @click="toggleConfirmPasswordVisibility"
                      :disabled="loading">
                      <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <div v-if="errors.confirmPassword && hasInteracted.confirmPassword" class="invalid-feedback d-block">{{ errors.confirmPassword }}</div>
                </div>
                
                <!-- Consent Fields -->
                <div class="mb-3">
                  <div class="form-check mb-2">
                    <input 
                      type="checkbox" 
                      class="form-check-input" 
                      id="marketingConsent" 
                      v-model="registrationForm.marketingConsent">
                    <label class="form-check-label" for="marketingConsent">
                      Kişiye özel pazarlama iletişimi almak istiyorum
                    </label>
                  </div>
                  
                  <div class="form-check mb-2">
                    <input 
                      type="checkbox" 
                      class="form-check-input" 
                      id="electronicConsent" 
                      v-model="registrationForm.electronicCommunicationConsent">
                    <label class="form-check-label" for="electronicConsent">
                      Elektronik ileti (e-posta, SMS) almayı kabul ediyorum
                    </label>
                  </div>
                  
                  <div class="form-check mb-3">
                    <input 
                      type="checkbox" 
                      class="form-check-input" 
                      id="membershipAgreement" 
                      v-model="registrationForm.membershipAgreementConsent"
                      :class="{ 'is-invalid': errors.membershipAgreementConsent && hasInteracted.membershipAgreementConsent }"
                      @blur="hasInteracted.membershipAgreementConsent = true"
                      required>
                    <label class="form-check-label" for="membershipAgreement">
                      <a href="#" class="text-decoration-none">Üyelik Sözleşmesi</a>'ni kabul ediyorum <span class="text-danger">*</span>
                    </label>
                    <div v-if="errors.membershipAgreementConsent && hasInteracted.membershipAgreementConsent" class="invalid-feedback d-block">{{ errors.membershipAgreementConsent }}</div>
                  </div>
                  
                  <!-- KVKK Açık Rıza Metni -->
                  <div class="alert alert-info py-2 px-3 small">
                    <h6 class="mb-2"><i class="bi bi-info-circle me-1"></i>Kişisel Verilerin Korunması Hakkında Bilgilendirme</h6>
                    <p class="mb-2">
                      <strong>Veri Sorumlusu:</strong> BetStarter A.Ş.<br>
                      <strong>İletişim:</strong> kvkk@betstarter.com
                    </p>
                    <p class="mb-2">
                      Kişisel verileriniz; üyelik işlemlerinin gerçekleştirilmesi, kimlik doğrulama, yasal yükümlülüklerin yerine getirilmesi, 
                      MASAK mevzuatına uyum, müşteri hizmetleri ve pazarlama faaliyetleri amacıyla işlenmektedir.
                    </p>
                    <p class="mb-0">
                      Verileriniz; yasal yükümlülükler, meşru menfaat ve açık rızanız kapsamında işlenir. 
                      Detaylı bilgi için <a href="#" class="text-decoration-none">KVKK Aydınlatma Metni</a>'ni inceleyebilirsiniz.
                    </p>
                  </div>
                </div>
                
                <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-phone me-2"></i>
                  SMS Kodu Gönder
                </button>
              </form>
            </div>

            <!-- Step 2: SMS OTP Verification -->
            <div v-else-if="currentStep === 2">
              <div class="text-center mb-4">
                <i class="bi bi-phone text-primary" style="font-size: 3rem;"></i>
                <h4 class="mt-3">SMS Doğrulama</h4>
                <p class="text-muted">
                  <strong>{{ maskedPhone }}</strong> numarasına gönderilen 4 haneli kodu giriniz.
                </p>
              </div>

              <form @submit.prevent="verifyOtp">
                <div class="mb-3">
                  <label for="otpCode" class="form-label text-center d-block">Doğrulama Kodu</label>
                  <div class="d-flex justify-content-center">
                    <input 
                      type="text" 
                      class="form-control text-center" 
                      id="otpCode" 
                      v-model="otpForm.otpCode"
                      :class="{ 'is-invalid': errors.otpCode }"
                      placeholder="1234"
                      maxlength="4"
                      style="max-width: 200px; font-size: 1.5rem; letter-spacing: 0.5rem;"
                      required>
                  </div>
                  <div v-if="errors.otpCode" class="invalid-feedback text-center d-block">{{ errors.otpCode }}</div>
                </div>

                <div class="text-center mb-3">
                  <small class="text-muted">
                    Kod gelmediyse <span v-if="resendCountdown > 0">{{ resendCountdown }} saniye</span>
                    <button 
                      v-else
                      type="button" 
                      class="btn btn-link p-0 text-decoration-none"
                      @click="resendOtp"
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

                <button type="button" class="btn btn-outline-secondary w-100" @click="goBackToForm">
                  <i class="bi bi-arrow-left me-2"></i>
                  Geri Dön
                </button>
              </form>
            </div>

            <!-- Step 3: Success -->
            <div v-else-if="currentStep === 3">
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
            </div>

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
    :details="errorModal.details"
    :show-retry="errorModal.showRetry"
    @close="closeErrorModal"
    @retry="retryLastAction"
  />

  <!-- Success Modal -->
  <SuccessModal 
    :show="showSuccessModal"
    :title="successModal.title"
    :message="successModal.message"
    :details="successModal.details"
    :show-action="successModal.showAction"
    :action-text="successModal.actionText"
    @close="closeSuccessModal"
    @action="successAction"
  />
</template>

<script setup lang="ts">
useHead({
  title: 'Üye Ol - BetStarter',
  meta: [
    { name: 'description', content: 'BetStarter\'a üye olun ve kazanmaya başlayın!' }
  ]
})

// Composables
const { registerRequest, verifyRegistration, loading, error, clearError } = useAuth()
const api = useApi()

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

// Interaction tracking for validation
const hasInteracted = reactive({
  firstName: false,
  lastName: false,
  tcKimlikNo: false,
  birthDate: false,
  email: false,
  phoneNumber: false,
  professionId: false,
  password: false,
  confirmPassword: false,
  membershipAgreementConsent: false
})

// Errors
const errors = reactive({
  firstName: '',
  lastName: '',
  tcKimlikNo: '',
  birthDate: '',
  email: '',
  phoneNumber: '',
  professionId: '',
  password: '',
  confirmPassword: '',
  membershipAgreementConsent: '',
  otpCode: ''
})

// Profession search
const professionSearch = ref('')
const showProfessionDropdown = ref(false)
const filteredProfessions = ref<Array<{id: number, name: string}>>([])

// Password visibility
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Professions data
const professions = ref<Array<{id: number, name: string}>>([])
const professionsLoading = ref(false)

// Error Modal
const showErrorModal = ref(false)
const errorModal = reactive({
  title: 'Bir Hata Oluştu',
  message: '',
  details: [] as string[],
  showRetry: false
})
let lastAction: (() => Promise<void>) | null = null

// Success Modal
const showSuccessModal = ref(false)
const successModal = reactive({
  title: '',
  message: '',
  details: [] as string[],
  showAction: false,
  actionText: ''
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
  Object.keys(errors).forEach(key => {
    (errors as any)[key] = ''
  })
}

const validateRegistrationForm = () => {
  clearErrors()
  let isValid = true

  if (!registrationForm.firstName.trim()) {
    errors.firstName = 'Ad girilmesi zorunludur'
    isValid = false
  }

  if (!registrationForm.lastName.trim()) {
    errors.lastName = 'Soyad girilmesi zorunludur'
    isValid = false
  }

  if (!registrationForm.tcKimlikNo.trim()) {
    errors.tcKimlikNo = 'TC Kimlik No girilmesi zorunludur'
    isValid = false
  } else if (!/^\d{11}$/.test(registrationForm.tcKimlikNo)) {
    errors.tcKimlikNo = 'TC Kimlik No 11 haneli olmalıdır'
    isValid = false
  }

  if (!registrationForm.birthDate) {
    errors.birthDate = 'Doğum tarihi girilmesi zorunludur'
    isValid = false
  } else {
    // 18 yaş kontrolü
    const birthDate = new Date(registrationForm.birthDate)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    if (age < 18) {
      errors.birthDate = '18 yaşından küçük kullanıcılar kayıt olamaz'
      isValid = false
    }
  }

  if (!registrationForm.email.trim()) {
    errors.email = 'E-posta girilmesi zorunludur'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registrationForm.email)) {
    errors.email = 'Geçerli bir e-posta adresi giriniz'
    isValid = false
  }

  if (!registrationForm.phoneNumber.trim()) {
    errors.phoneNumber = 'Telefon numarası girilmesi zorunludur'
    isValid = false
  } else if (!/^5\d{2}(\s?\d{3}\s?\d{2}\s?\d{2}|\d{7})$/.test(registrationForm.phoneNumber)) {
    errors.phoneNumber = 'Telefon numarası 5XXXXXXXXX veya 5XX XXX XX XX formatında olmalıdır'
    isValid = false
  }

  if (!registrationForm.professionId) {
    errors.professionId = 'Meslek seçimi zorunludur'
    isValid = false
  }

  if (!registrationForm.password.trim()) {
    errors.password = 'Şifre girilmesi zorunludur'
    isValid = false
  } else if (registrationForm.password.length < 8) {
    errors.password = 'Şifre en az 8 karakter olmalıdır'
    isValid = false
  }

  if (!registrationForm.confirmPassword.trim()) {
    errors.confirmPassword = 'Şifre tekrarı girilmesi zorunludur'
    isValid = false
  } else if (registrationForm.password !== registrationForm.confirmPassword) {
    errors.confirmPassword = 'Şifreler eşleşmiyor'
    isValid = false
  }

  if (!registrationForm.membershipAgreementConsent) {
    errors.membershipAgreementConsent = 'Üyelik sözleşmesini kabul etmelisiniz'
    isValid = false
  }

  return isValid
}

// Profession search methods
const filterProfessions = () => {
  const searchTerm = professionSearch.value.toLowerCase()
  if (searchTerm.length === 0) {
    filteredProfessions.value = professions.value.slice(0, 10) // Show first 10
  } else {
    filteredProfessions.value = professions.value
      .filter(p => p.name.toLowerCase().includes(searchTerm))
      .slice(0, 10) // Limit to 10 results
  }
}

const selectProfession = (profession: {id: number, name: string}) => {
  registrationForm.professionId = profession.id.toString()
  professionSearch.value = profession.name
  showProfessionDropdown.value = false
  hasInteracted.professionId = true
}

const hideProfessionDropdown = () => {
  setTimeout(() => {
    showProfessionDropdown.value = false
  }, 200) // Delay to allow click events
}

// Password visibility toggles
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const submitRegistration = async () => {
  // Mark all fields as interacted for validation
  Object.keys(hasInteracted).forEach(key => {
    (hasInteracted as any)[key] = true
  })

  if (!validateRegistrationForm()) {
    // Show validation errors in modal
    const validationErrors = Object.entries(errors)
      .filter(([key, value]) => value && key !== 'otpCode')
      .map(([key, value]) => value as string)
    
    if (validationErrors.length > 0) {
      showError(
        'Lütfen aşağıdaki alanları kontrol ediniz:',
        'Form Hatası',
        validationErrors
      )
    }
    return
  }

  clearError()
  clearErrors() // Clear all field errors before making request
  
  lastAction = submitRegistration
  
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
    // Map backend errors to specific fields
    mapBackendErrorToField(result.error)
    
    // Also show in modal for better visibility
    showError(
      result.error,
      'Kayıt Hatası',
      undefined,
      true // Show retry button
    )
  }
}

// Map backend error messages to specific form fields
const mapBackendErrorToField = (errorMessage: string) => {
  const errorLower = errorMessage.toLowerCase()
  let errorMapped = false
  
  if (errorLower.includes('email') || errorLower.includes('e-posta')) {
    errors.email = errorMessage
    errorMapped = true
  } else if (errorLower.includes('telefon') || errorLower.includes('phone')) {
    errors.phoneNumber = errorMessage
    errorMapped = true
  } else if (errorLower.includes('tc kimlik') || errorLower.includes('tckn')) {
    errors.tcKimlikNo = errorMessage
    errorMapped = true
  } else if (errorLower.includes('şifre') || errorLower.includes('password')) {
    errors.password = errorMessage
    errorMapped = true
  } else if (errorLower.includes('doğum') || errorLower.includes('birth')) {
    errors.birthDate = errorMessage
    errorMapped = true
  } else if (errorLower.includes('ad') && errorLower.includes('soyad')) {
    errors.firstName = errorMessage
    errorMapped = true
  } else if (errorLower.includes('meslek') || errorLower.includes('profession')) {
    errors.professionId = errorMessage
    errorMapped = true
  }
  
  // If error was mapped to a field, clear the general error
  if (errorMapped) {
    clearError()
  }
}

const verifyOtp = async () => {
  if (!otpForm.otpCode.trim()) {
    errors.otpCode = 'Doğrulama kodu girilmesi zorunludur'
    showError('Doğrulama kodu girilmesi zorunludur', 'Geçersiz Kod')
    return
  }

  if (!/^\d{4}$/.test(otpForm.otpCode)) {
    errors.otpCode = 'Doğrulama kodu 4 haneli olmalıdır'
    showError('Doğrulama kodu 4 haneli olmalıdır', 'Geçersiz Kod')
    return
  }

  clearError()
  errors.otpCode = ''
  
  lastAction = verifyOtp

  const result = await verifyRegistration({
    phoneNumber: otpForm.phoneNumber,
    otpCode: otpForm.otpCode
  })

  if (result.success) {
    currentStep.value = 3
    showSuccess(
      'Hesabınız başarıyla oluşturuldu!',
      'Üyelik Tamamlandı',
      ['Artık giriş yapabilir ve hizmetlerimizden faydalanabilirsiniz'],
      true,
      'Giriş Yap'
    )
  } else if (result.error) {
    // Map OTP related errors to the OTP field
    errors.otpCode = result.error
    
    // Show in modal with retry option
    showError(
      result.error,
      'Doğrulama Hatası',
      undefined,
      true // Show retry button
    )
  }
}

const resendOtp = async () => {
  clearError()
  clearErrors() // Clear all field errors before making request
  
  lastAction = resendOtp
  
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
      'SMS Gönderildi',
      ['Doğrulama kodunuz telefon numaranıza gönderildi']
    )
  } else if (result.error) {
    // Map backend errors to specific fields during resend
    mapBackendErrorToField(result.error)
    
    // Show in modal with retry option
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

// Load professions on mount
const loadProfessions = async () => {
  professionsLoading.value = true
  try {
    const response = await api.utils.getProfessions()
    if (response.isSuccess && response.data) {
      professions.value = response.data.map(p => ({ id: p.id, name: p.name }))
      filteredProfessions.value = professions.value.slice(0, 10) // Show first 10 initially
    } else {
      console.error('Failed to load professions:', response.error)
      // Fallback to hardcoded list
      professions.value = [
        { id: 152, name: 'Öğrenci' },
        { id: 151, name: 'Emekli' },
        { id: 150, name: 'Serbest Meslek' },
        { id: 155, name: 'Diğer' }
      ]
      filteredProfessions.value = professions.value
    }
  } catch (error) {
    console.error('Error loading professions:', error)
    // Fallback to hardcoded list
    professions.value = [
      { id: 152, name: 'Öğrenci' },
      { id: 151, name: 'Emekli' },
      { id: 150, name: 'Serbest Meslek' },
      { id: 155, name: 'Diğer' }
    ]
    filteredProfessions.value = professions.value
  } finally {
    professionsLoading.value = false
  }
}

onMounted(() => {
  loadProfessions()
})

// Cleanup
onUnmounted(() => {
  if (resendTimer) {
    clearInterval(resendTimer)
  }
})

// Show error modal with details
const showError = (message: string, title?: string, details?: string[], showRetry: boolean = false) => {
  errorModal.title = title || 'Bir Hata Oluştu'
  errorModal.message = message
  errorModal.details = details || []
  errorModal.showRetry = showRetry
  showErrorModal.value = true
}

// Close error modal
const closeErrorModal = () => {
  showErrorModal.value = false
  errorModal.details = []
  errorModal.showRetry = false
}

// Retry last action
const retryLastAction = async () => {
  if (lastAction) {
    closeErrorModal()
    await lastAction()
  }
}

// Success modal methods
const showSuccess = (message: string, title?: string, details?: string[], showAction: boolean = false, actionText: string = '') => {
  successModal.title = title || 'Başarılı'
  successModal.message = message
  successModal.details = details || []
  successModal.showAction = showAction
  successModal.actionText = actionText
  showSuccessModal.value = true
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  successModal.details = []
  successModal.showAction = false
}

const successAction = () => {
  // Implementation of success action
  closeSuccessModal()
  navigateTo('/auth/login')
}
</script>