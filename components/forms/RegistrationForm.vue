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
            @blur="hasInteracted.firstName = true"
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
            @blur="hasInteracted.lastName = true"
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
        @blur="hasInteracted.tcKimlikNo = true"
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
        @blur="hasInteracted.birthDate = true"
        required>
      <div v-if="getFieldError('birthDate')" class="invalid-feedback">
        <i class="bi bi-exclamation-circle me-1"></i>{{ getFieldError('birthDate') }}
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
        @blur="hasInteracted.email = true"
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
        @blur="hasInteracted.phoneNumber = true"
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
      @blur="hasInteracted.professionId = true"
      @selection-changed="onProfessionChange" />
    
    <div class="mb-3">
      <label for="password" class="form-label">Şifre <span class="text-danger">*</span></label>
      <div class="input-group">
        <input 
          :type="showPassword ? 'text' : 'password'" 
          class="form-control" 
          id="password" 
          v-model="form.password"
          :class="{ 'is-invalid': hasFieldError('password') }"
          @blur="hasInteracted.password = true"
          placeholder="En az 8 karakter, büyük/küçük harf, rakam ve özel karakter"
          required>
        <button 
          type="button" 
          class="btn btn-outline-secondary"
          @click="showPassword = !showPassword"
          :disabled="loading">
          <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
        </button>
      </div>
      <div v-if="getFieldError('password')" class="invalid-feedback d-block">{{ getFieldError('password') }}</div>
    </div>
    
    <div class="mb-3">
      <label for="confirmPassword" class="form-label">Şifre Tekrar <span class="text-danger">*</span></label>
      <div class="input-group">
        <input 
          :type="showConfirmPassword ? 'text' : 'password'" 
          class="form-control" 
          id="confirmPassword" 
          v-model="form.confirmPassword"
          :class="{ 'is-invalid': hasFieldError('confirmPassword') }"
          @blur="hasInteracted.confirmPassword = true"
          placeholder="Şifrenizi tekrar girin"
          required>
        <button 
          type="button" 
          class="btn btn-outline-secondary"
          @click="showConfirmPassword = !showConfirmPassword"
          :disabled="loading">
          <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
        </button>
      </div>
      <div v-if="getFieldError('confirmPassword')" class="invalid-feedback d-block">{{ getFieldError('confirmPassword') }}</div>
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
          @blur="hasInteracted.membershipAgreementConsent = true"
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
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Form validation
const validationSchema = {
  firstName: { required: true },
  lastName: { required: true },
  tcKimlikNo: { 
    required: true, 
    pattern: /^\d{11}$/,
    custom: (value: string) => value.length !== 11 ? 'TC Kimlik No 11 haneli olmalıdır' : null
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
    pattern: /^5\d{2}(\s?\d{3}\s?\d{2}\s?\d{2}|\d{7})$/,
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

const { hasInteracted, validate, getFieldError, hasFieldError, validationErrors, markAllAsInteracted } = useFormValidation(props.form, validationSchema)

// Password visibility
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const onProfessionChange = (profession: {id: number, name: string} | null) => {
  // Clear profession error when valid selection is made
  if (profession) {
    // Error will be cleared automatically by validation
  }
}

const handleSubmit = () => {
  markAllAsInteracted()
  
  if (validate()) {
    emit('submit')
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>
