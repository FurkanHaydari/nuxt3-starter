<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-body p-4">
            <div class="text-center mb-4">
              <h2 class="h4 fw-bold">Şifremi Unuttum</h2>
              <p class="text-muted">{{ currentStepDescription }}</p>
            </div>

            <!-- Step 1: TC Kimlik No/Üye No + Doğum Tarihi -->
            <form v-if="currentStep === 1" @submit.prevent="handleStep1Submit">
              <div class="mb-3">
                <label for="tcknOrMemberNumber" class="form-label">TC Kimlik No / Üye No *</label>
                <input 
                  v-model="step1Form.tcknOrMemberNumber"
                  type="text" 
                  class="form-control" 
                  :class="{ 'is-invalid': tcknError && hasInteracted.tckn }"
                  id="tcknOrMemberNumber" 
                  placeholder="TC Kimlik No veya Üye No"
                  :disabled="loading"
                  @input="validateTcknOrMemberNumberField"
                  @blur="hasInteracted.tckn = true; validateTcknOrMemberNumberField()"
                  required>
                <div v-if="tcknError && hasInteracted.tckn" class="invalid-feedback">
                  {{ tcknError }}
                </div>
              </div>
              
              <div class="mb-3">
                <label for="birthDate" class="form-label">Doğum Tarihi *</label>
                <input 
                  v-model="step1Form.birthDate"
                  type="date" 
                  class="form-control" 
                  :class="{ 'is-invalid': birthDateError && hasInteracted.birthDate }"
                  id="birthDate"
                  :disabled="loading"
                  :max="maxBirthDate"
                  :min="minBirthDate"
                  @input="validateBirthDateField"
                  @blur="hasInteracted.birthDate = true; validateBirthDateField()"
                  required>
                <div v-if="birthDateError && hasInteracted.birthDate" class="invalid-feedback">
                  {{ birthDateError }}
                </div>
              </div>
              
              <button 
                type="submit" 
                class="btn btn-primary w-100 mb-3"
                :disabled="loading || !isStep1Valid">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <i v-else class="bi bi-arrow-right me-2"></i>
                {{ loading ? 'Kontrol ediliyor...' : 'Devam' }}
              </button>
            </form>

            <!-- Step 2: Email/SMS Seçimi -->
            <div v-else-if="currentStep === 2">
              <div class="mb-4">
                <p class="text-success mb-3">
                  <i class="bi bi-check-circle me-2"></i>
                  Bilgileriniz doğrulandı. Şifre sıfırlama yöntemini seçiniz:
                </p>
              </div>

              <form @submit.prevent="handleStep2Submit">
                <div class="mb-3">
                  <div v-if="contactInfo.hasEmail" class="form-check mb-2">
                    <input 
                      v-model="step2Form.method"
                      class="form-check-input" 
                      type="radio" 
                      name="resetMethod" 
                      id="emailMethod"
                      value="email"
                      :disabled="loading">
                    <label class="form-check-label d-flex align-items-center" for="emailMethod">
                      <i class="bi bi-envelope me-2"></i>
                      <div>
                        <strong>E-posta Adresi</strong><br>
                        <small class="text-muted">{{ contactInfo.maskedEmail }}</small>
                      </div>
                    </label>
                  </div>

                  <div v-if="contactInfo.hasPhone" class="form-check mb-2">
                    <input 
                      v-model="step2Form.method"
                      class="form-check-input" 
                      type="radio" 
                      name="resetMethod" 
                      id="smsMethod"
                      value="sms"
                      :disabled="loading">
                    <label class="form-check-label d-flex align-items-center" for="smsMethod">
                      <i class="bi bi-phone me-2"></i>
                      <div>
                        <strong>Telefon Numarası</strong><br>
                        <small class="text-muted">{{ contactInfo.maskedPhone }}</small>
                      </div>
                    </label>
                  </div>
                </div>

                <button 
                  type="submit" 
                  class="btn btn-primary w-100 mb-3"
                  :disabled="loading || !step2Form.method">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i v-else class="bi bi-send me-2"></i>
                  {{ loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Linki Gönder' }}
                </button>

                <button 
                  type="button" 
                  class="btn btn-outline-secondary w-100"
                  @click="goBackToStep1"
                  :disabled="loading">
                  <i class="bi bi-arrow-left me-2"></i>
                  Geri Dön
                </button>
              </form>
            </div>

            <!-- Step 3: Başarılı Gönderim -->
            <div v-else-if="currentStep === 3" class="text-center">
              <div class="mb-4">
                <i class="bi bi-check-circle-fill text-success" style="font-size: 3rem;"></i>
              </div>
              <h4 class="text-success mb-3">Şifre Sıfırlama Linki Gönderilmiştir</h4>
              <p class="mb-4">{{ finalMessage }}</p>
              <p class="text-muted small mb-4">
                <i class="bi bi-clock me-1"></i>
                Bu link 15 dakika süreyle geçerlidir.
              </p>
              <button 
                type="button" 
                class="btn btn-outline-primary w-100"
                @click="resetToStep1">
                <i class="bi bi-arrow-left me-2"></i>
                Yeni İstek Gönder
              </button>
            </div>
            
            <div class="text-center mt-3">
              <NuxtLink to="/auth/login" class="text-decoration-none">
                <i class="bi bi-arrow-left me-1"></i>
                Giriş sayfasına dön
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
  title: 'Şifremi Unuttum - BetStarter',
  meta: [
    { name: 'description', content: 'Şifrenizi sıfırlayın' }
  ]
})

// Auth composable
const { validateTckn } = useAuth()

// Current step management
const currentStep = ref(1) // 1: TC+DoğumTarihi, 2: Email/SMS Seçimi, 3: Başarılı

// Form data
const step1Form = reactive({
  tcknOrMemberNumber: '',
  birthDate: ''
})

const step2Form = reactive({
  method: '' // 'email' or 'sms'
})

// Interaction tracking for validation
const hasInteracted = reactive({
  tckn: false,
  birthDate: false
})

// Contact info from step 1 response
const contactInfo = reactive({
  maskedEmail: '',
  maskedPhone: '',
  hasEmail: false,
  hasPhone: false
})

// State
const loading = ref(false)
const finalMessage = ref('')

// Validation errors
const tcknError = ref('')
const birthDateError = ref('')

// Error/Success Modals
const showErrorModal = ref(false)
const errorModal = reactive({
  title: 'Bir Hata Oluştu',
  message: '',
  details: [] as string[],
  showRetry: false
})
let lastAction: (() => Promise<void>) | null = null

const showSuccessModal = ref(false)
const successModal = reactive({
  title: '',
  message: '',
  details: [] as string[],
  showAction: false,
  actionText: ''
})

// Date constraints for birth date (18+ years old)
const today = new Date()
const maxBirthDate = computed(() => {
  const date = new Date(today)
  date.setFullYear(today.getFullYear() - 18)
  return date.toISOString().split('T')[0]
})
const minBirthDate = computed(() => {
  const date = new Date(today)
  date.setFullYear(today.getFullYear() - 100)
  return date.toISOString().split('T')[0]
})

// Computed properties
const currentStepDescription = computed(() => {
  switch (currentStep.value) {
    case 1: return 'TC Kimlik No/Üye No ve Doğum Tarihinizi girin'
    case 2: return 'Şifre sıfırlama yöntemini seçin'
    case 3: return 'İşlem tamamlandı'
    default: return ''
  }
})

const isStep1Valid = computed(() => {
  return step1Form.tcknOrMemberNumber && 
         step1Form.birthDate && 
         !tcknError.value && 
         !birthDateError.value
})

// Validation functions
const validateTcknOrMemberNumberField = () => {
  const validation = validateTckn(step1Form.tcknOrMemberNumber)
  tcknError.value = validation.isValid ? '' : validation.error || ''
}

const validateBirthDateField = () => {
  if (!step1Form.birthDate) {
    birthDateError.value = 'Doğum Tarihi girilmesi zorunludur.'
    return
  }

  const birthDate = new Date(step1Form.birthDate)
  const today = new Date()
  
  if (isNaN(birthDate.getTime())) {
    birthDateError.value = 'Geçerli bir tarih giriniz.'
    return
  }

  // 18 yaş kontrolü
  const age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  const dayDiff = today.getDate() - birthDate.getDate()
  
  let actualAge = age
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    actualAge--
  }

  if (actualAge < 18) {
    const minDate = new Date(today)
    minDate.setFullYear(today.getFullYear() - 100)
    const maxDate = new Date(today)
    maxDate.setFullYear(today.getFullYear() - 18)
    
    birthDateError.value = `Doğum Tarihi ${minDate.toLocaleDateString('tr-TR')} ile ${maxDate.toLocaleDateString('tr-TR')} tarihleri arasında olmalıdır.`
    return
  }

  birthDateError.value = ''
}

// Step handlers
const handleStep1Submit = async () => {
  // Mark all fields as interacted for validation
  hasInteracted.tckn = true
  hasInteracted.birthDate = true
  
  // Final validation
  validateTcknOrMemberNumberField()
  validateBirthDateField()
  
  if (!isStep1Valid.value) {
    // Frontend validation errors are already shown under fields
    return
  }

  loading.value = true
  lastAction = handleStep1Submit

  try {
    const api = useApi()
    const response = await api.auth.forgotPassword({
      tcknOrMemberNumber: step1Form.tcknOrMemberNumber,
      birthDate: step1Form.birthDate + 'T00:00:00Z'
    })

    if (response.isSuccess && response.data) {
      // Backend'den gelen response ForgotPasswordResponse tipinde
      if (response.data.success) {
        // Gerçekten başarılı ise
        contactInfo.maskedEmail = response.data.maskedEmail || ''
        contactInfo.maskedPhone = response.data.maskedPhone || ''
        contactInfo.hasEmail = response.data.hasEmail || false
        contactInfo.hasPhone = response.data.hasPhone || false
        
        currentStep.value = 2
      } else {
        // Backend'de doğrulama başarısız
        showError(
          response.data.message || 'Bilgiler kontrol edilirken hata oluştu',
          'Doğrulama Hatası',
          undefined,
          true // Show retry button
        )
      }
    } else {
      showError(
        response.error || 'Bilgiler kontrol edilirken hata oluştu',
        'Doğrulama Hatası',
        undefined,
        true // Show retry button
      )
    }
  } catch (error: any) {
    showError(
      error?.message || 'Beklenmeyen bir hata oluştu',
      'Doğrulama Hatası',
      undefined,
      true // Show retry button
    )
  } finally {
    loading.value = false
  }
}

const handleStep2Submit = async () => {
  if (!step2Form.method) {
    return
  }

  loading.value = true
  lastAction = handleStep2Submit

  try {
    const api = useApi()
    const response = await api.auth.selectResetMethod({
      tcknOrMemberNumber: step1Form.tcknOrMemberNumber,
      birthDate: step1Form.birthDate + 'T00:00:00Z',
      method: step2Form.method === 'email' ? 1 : 2 // ResetMethod enum
    })

    if (response.isSuccess) {
      finalMessage.value = response.data || 'Şifre sıfırlama bağlantısı gönderilmiştir.'
      currentStep.value = 3
      showSuccess(
        'Şifre sıfırlama linki başarıyla gönderildi',
        'İşlem Başarılı',
        [finalMessage.value]
      )
    } else {
      showError(
        response.error || 'Şifre sıfırlama linki gönderilirken hata oluştu',
        'Gönderim Hatası',
        undefined,
        true // Show retry button
      )
    }
  } catch (error: any) {
    showError(
      error?.message || 'Beklenmeyen bir hata oluştu',
      'Gönderim Hatası',
      undefined,
      true // Show retry button
    )
  } finally {
    loading.value = false
  }
}

// Navigation functions
const goBackToStep1 = () => {
  currentStep.value = 1
}

const resetToStep1 = () => {
  currentStep.value = 1
  step1Form.tcknOrMemberNumber = ''
  step1Form.birthDate = ''
  step2Form.method = ''
  finalMessage.value = ''
  tcknError.value = ''
  birthDateError.value = ''
  hasInteracted.tckn = false
  hasInteracted.birthDate = false
  
  // Reset contact info
  contactInfo.maskedEmail = ''
  contactInfo.maskedPhone = ''
  contactInfo.hasEmail = false
  contactInfo.hasPhone = false
}

// Modal functions
const showError = (message: string, title?: string, details?: string[], showRetry: boolean = false) => {
  errorModal.title = title || 'Bir Hata Oluştu'
  errorModal.message = message
  errorModal.details = details || []
  errorModal.showRetry = showRetry
  showErrorModal.value = true
}

const closeErrorModal = () => {
  showErrorModal.value = false
  errorModal.details = []
  errorModal.showRetry = false
}

const retryLastAction = async () => {
  if (lastAction) {
    closeErrorModal()
    await lastAction()
  }
}

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
  closeSuccessModal()
}
</script> 