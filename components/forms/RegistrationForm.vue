<template>
  <form @submit.prevent="handleSubmit">
    <div class="row">
      <div class="col-md-6">
        <div class="mb-3">
          <label for="firstName" class="form-label">Ad <span class="text-danger">*</span></label>
          <input 
            type="text" 
            class="form-control" 
            id="firstName" 
            v-model="form.firstName"
            :class="{ 'is-invalid': hasFieldError('firstName') }"
            @input="hasInteracted.firstName = true; validateField('firstName')"
            @blur="hasInteracted.firstName = true; validateField('firstName')"
            required>
          <div v-if="getFieldError('firstName')" class="invalid-feedback">
            <i class="bi bi-exclamation-circle me-1"></i>{{ getFieldError('firstName') }}
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="mb-3">
          <label for="lastName" class="form-label">Soyad <span class="text-danger">*</span></label>
          <input 
            type="text" 
            class="form-control" 
            id="lastName" 
            v-model="form.lastName"
            :class="{ 'is-invalid': hasFieldError('lastName') }"
            @input="hasInteracted.lastName = true; validateField('lastName')"
            @blur="hasInteracted.lastName = true; validateField('lastName')"
            required>
          <div v-if="getFieldError('lastName')" class="invalid-feedback">
            <i class="bi bi-exclamation-circle me-1"></i>{{ getFieldError('lastName') }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="mb-3">
      <label for="tcKimlikNo" class="form-label">TC Kimlik No <span class="text-danger">*</span></label>
      <input 
        type="text" 
        class="form-control" 
        id="tcKimlikNo" 
        v-model="form.tcKimlikNo"
        :class="{ 'is-invalid': hasFieldError('tcKimlikNo') }"
        @input="hasInteracted.tcKimlikNo = true; validateField('tcKimlikNo')"
        @blur="hasInteracted.tcKimlikNo = true; validateField('tcKimlikNo')"
        placeholder="11 haneli TC Kimlik numaranız"
        maxlength="11"
        required>
      <div v-if="getFieldError('tcKimlikNo')" class="invalid-feedback">
        <i class="bi bi-exclamation-circle me-1"></i>{{ getFieldError('tcKimlikNo') }}
      </div>
    </div>
    
    <div class="mb-3">
      <label for="birthDate" class="form-label">Doğum Tarihi <span class="text-danger">*</span></label>
      <input 
        type="date" 
        class="form-control" 
        id="birthDate" 
        v-model="form.birthDate"
        :class="{ 'is-invalid': hasFieldError('birthDate') }"
        :max="maxBirthDate"
        :min="minBirthDate"
        @input="hasInteracted.birthDate = true; validateField('birthDate')"
        @blur="hasInteracted.birthDate = true; validateField('birthDate')"
        required>
      <div v-if="getFieldError('birthDate')" class="invalid-feedback">
        <i class="bi bi-exclamation-circle me-1"></i>{{ getFieldError('birthDate') }}
      </div>
      <div class="form-text">
        18 yaşından büyük olmanız gerekmektedir.
      </div>
    </div>
    
    <div class="mb-3">
      <label for="email" class="form-label">E-posta Adresi <span class="text-danger">*</span></label>
      <input 
        type="email" 
        class="form-control" 
        id="email" 
        v-model="form.email"
        :class="{ 'is-invalid': hasFieldError('email') }"
        @input="hasInteracted.email = true; validateField('email')"
        @blur="hasInteracted.email = true; validateField('email')"
        required>
      <div v-if="getFieldError('email')" class="invalid-feedback">
        <i class="bi bi-exclamation-circle me-1"></i>{{ getFieldError('email') }}
      </div>
    </div>
    
    <div class="mb-3">
      <label for="phone" class="form-label">Telefon Numarası <span class="text-danger">*</span></label>
      <input 
        type="tel" 
        class="form-control" 
        id="phone" 
        v-model="form.phoneNumber"
        :class="{ 'is-invalid': hasFieldError('phoneNumber') }"
        @input="hasInteracted.phoneNumber = true; validateField('phoneNumber')"
        @blur="hasInteracted.phoneNumber = true; validateField('phoneNumber')"
        placeholder="5XXXXXXXXX veya 5XX XXX XX XX"
        required>
      <div v-if="getFieldError('phoneNumber')" class="invalid-feedback">
        <i class="bi bi-exclamation-circle me-1"></i>{{ getFieldError('phoneNumber') }}
      </div>
    </div>
    
    <!-- Profession Field -->
    <FormProfessionField
      v-model="form.professionId"
      field-id="profession"
      :required="true"
      variant="searchable"
      :frontend-error="getFieldError('professionId')"
      :backend-error="''"
      @blur="hasInteracted.professionId = true; validateField('professionId')"
      @selection-changed="onProfessionChange" />
    
    <!-- Password Field -->
    <FormPasswordField
      v-model="form.password"
      field-id="password"
      label="Şifre"
      placeholder="En az 8 karakter, büyük/küçük harf, rakam ve özel karakter"
      :disabled="loading"
      :error-message="getFieldError('password')"
      :require-special-char="true"
      :min-strength-score="3"
      @input="hasInteracted.password = true; validateField('password')"
      @blur="hasInteracted.password = true; validateField('password')"
      @validation-change="onPasswordValidationChange"
    />
    
    <!-- Confirm Password Field -->
    <FormPasswordField
      v-model="form.confirmPassword"
      field-id="confirmPassword"
      label="Şifre Tekrar"
      placeholder="Şifrenizi tekrar girin"
      :disabled="loading"
      :error-message="getFieldError('confirmPassword')"
      :show-strength-indicator="false"
      :show-requirements="false"
      :require-special-char="true"
      :min-strength-score="3"
      @input="hasInteracted.confirmPassword = true; validateField('confirmPassword')"
      @blur="hasInteracted.confirmPassword = true; validateField('confirmPassword')"
    />
    
    <!-- Enhanced password match indicator -->
    <div v-if="form.confirmPassword" class="mt-2 mb-3">
      <div v-if="form.password === form.confirmPassword" class="d-flex align-items-center">
        <i class="bi bi-check-circle text-success me-2"></i>
        <small class="text-success fw-medium">Şifreler eşleşiyor</small>
      </div>
      <div v-else class="d-flex align-items-center">
        <i class="bi bi-x-circle text-danger me-2"></i>
        <small class="text-danger fw-medium">Şifreler eşleşmiyor</small>
      </div>
    </div>
    
    <!-- Consent Fields -->
    <div class="mb-3">
      <div class="form-check mb-2">
        <input 
          type="checkbox" 
          class="form-check-input" 
          id="marketingConsent" 
          v-model="form.marketingConsent">
        <label class="form-check-label" for="marketingConsent">
          Kişiye özel pazarlama iletişimi almak istiyorum
        </label>
      </div>
      
      <div class="form-check mb-2">
        <input 
          type="checkbox" 
          class="form-check-input" 
          id="electronicConsent" 
          v-model="form.electronicCommunicationConsent">
        <label class="form-check-label" for="electronicConsent">
          Elektronik ileti (e-posta, SMS) almayı kabul ediyorum
        </label>
      </div>
      
      <div class="form-check mb-3">
        <input 
          type="checkbox" 
          class="form-check-input" 
          id="membershipAgreement" 
          v-model="form.membershipAgreementConsent"
          :class="{ 'is-invalid': hasFieldError('membershipAgreementConsent') }"
          @change="hasInteracted.membershipAgreementConsent = true; validateField('membershipAgreementConsent')"
          @blur="hasInteracted.membershipAgreementConsent = true; validateField('membershipAgreementConsent')"
          required>
        <label class="form-check-label" for="membershipAgreement">
          <a href="#" class="text-decoration-none">Üyelik Sözleşmesi</a>'ni kabul ediyorum <span class="text-danger">*</span>
        </label>
        <div v-if="getFieldError('membershipAgreementConsent')" class="invalid-feedback d-block">{{ getFieldError('membershipAgreementConsent') }}</div>
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
    
    <!-- Frontend Validation Summary -->
    <div v-if="validationErrors.length > 0" class="alert alert-danger mb-3">
      <h6 class="alert-heading">
        <i class="bi bi-exclamation-triangle me-2"></i>
        Lütfen aşağıdaki hataları düzeltin:
      </h6>
      <ul class="mb-0 ps-3">
        <li v-for="error in validationErrors" :key="error">{{ error }}</li>
      </ul>
    </div>

    <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="loading">
      <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
      <i v-else class="bi bi-phone me-2"></i>
      SMS Kodu Gönder
    </button>
  </form>
</template>

<script setup lang="ts">
interface Props {
  form: any
  loading: boolean
}

interface Emits {
  (e: 'submit'): void
  (e: 'validation-error', errors: string[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Field labels for better error messages
const fieldLabels = {
  firstName: 'Ad',
  lastName: 'Soyad',
  tcKimlikNo: 'TC Kimlik No',
  birthDate: 'Doğum Tarihi',
  email: 'E-posta Adresi',
  phoneNumber: 'Telefon Numarası',
  professionId: 'Meslek',
  password: 'Şifre',
  confirmPassword: 'Şifre Tekrarı',
  membershipAgreementConsent: 'Üyelik Sözleşmesi'
}

// Form validation
const validationSchema = {
  firstName: { required: true },
  lastName: { required: true },
  tcKimlikNo: { 
    required: true, 
    custom: (value: string) => {
      if (!value) return null
      
      // Uzunluk kontrolü
      if (value.length !== 11) {
        return 'TC Kimlik No 11 haneli olmalıdır'
      }
      
      // Sayı kontrolü
      if (!/^\d{11}$/.test(value)) {
        return 'TC Kimlik No sadece rakam içermelidir'
      }
      
      // İlk rakam 0 olamaz
      if (value[0] === '0') {
        return 'TC Kimlik No 0 ile başlayamaz'
      }
      
      // TCKN algoritması kontrolü
      const digits = value.split('').map(Number)
      
      // 10. rakam kontrolü (tek basamakların toplamı * 7 - çift basamakların toplamı) mod 10
      const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8]
      const evenSum = digits[1] + digits[3] + digits[5] + digits[7]
      const tenthDigit = ((oddSum * 7) - evenSum) % 10
      
      if (tenthDigit !== digits[9]) {
        return 'Geçersiz TC Kimlik No'
      }
      
      // 11. rakam kontrolü (ilk 10 rakamın toplamının mod 10'u)
      const sumFirst10 = digits.slice(0, 10).reduce((a, b) => a + b, 0)
      const eleventhDigit = sumFirst10 % 10
      
      if (eleventhDigit !== digits[10]) {
        return 'Geçersiz TC Kimlik No'
      }
      
      return null
    }
  },
  birthDate: { 
    required: true,
    custom: (value: string) => {
      if (!value) return null
      const birthDate = new Date(value)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      return age < 18 ? '18 yaşından küçük kullanıcılar kayıt olamaz' : null
    }
  },
  email: { required: true, email: true },
  phoneNumber: { 
    required: true, 
    custom: (value: string) => {
      if (!value) return null
      return !/^5\d{2}(\s?\d{3}\s?\d{2}\s?\d{2}|\d{7})$/.test(value) 
        ? 'Telefon numarası 5XXXXXXXXX veya 5XX XXX XX XX formatında olmalıdır' 
        : null
    }
  },
  professionId: { required: true },
  password: { required: true, minLength: 8 },
  confirmPassword: { 
    required: true,
    custom: (value: string) => {
      return value !== props.form.password ? 'Şifreler eşleşmiyor' : null
    }
  },
  membershipAgreementConsent: { 
    required: true,
    custom: (value: boolean) => !value ? 'Üyelik sözleşmesini kabul etmelisiniz' : null
  }
}

const { hasInteracted, validate, validateField, getFieldError, hasFieldError, validationErrors, markAllAsInteracted } = useFormValidation(props.form, validationSchema, fieldLabels)

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

// Password validation state from PasswordField component
const passwordValidation = ref({
  isValid: false,
  score: 0,
  requirements: {},
  strength: {}
})

// Password validation change handler from PasswordField
const onPasswordValidationChange = (data: any) => {
  passwordValidation.value = data
  
  // Also re-validate confirm password if it has been entered
  if (props.form.confirmPassword) {
    validateField('confirmPassword')
  }
}

const onProfessionChange = (profession: {id: number, name: string} | null) => {
  // Mark as interacted and validate when profession changes
  hasInteracted.professionId = true
  validateField('professionId')
}

const handleSubmit = () => {
  markAllAsInteracted()
  
  if (validate()) {
    emit('submit')
  } else {
    // Emit validation errors to parent
    emit('validation-error', validationErrors.value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>
