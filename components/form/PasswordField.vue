<template>
  <div class="password-field">
    <!-- Password Input -->
    <div class="mb-3">
      <label :for="fieldId" class="form-label">
        {{ label }} 
        <span v-if="required" class="text-danger">*</span>
      </label>
      <div class="input-group">
        <input 
          :id="fieldId"
          v-model="internalValue"
          :type="showPassword ? 'text' : 'password'"
          class="form-control" 
          :class="{ 
            'is-invalid': hasError,
            'is-valid': internalValue && !hasError && passwordStrength.score >= minStrengthScore
          }"
          :placeholder="placeholder"
          :disabled="disabled"
          @input="onInput"
          @blur="onBlur"
          :required="required">
        <button 
          type="button" 
          class="btn btn-outline-secondary"
          @click="showPassword = !showPassword"
          :disabled="disabled">
          <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
        </button>
      </div>
      
      <!-- Error Message -->
      <div v-if="hasError" class="invalid-feedback">
        {{ errorMessage }}
      </div>

      <!-- Password Strength Indicator -->
      <div v-if="internalValue && showStrengthIndicator" class="mt-2">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <small class="text-muted">Şifre Gücü:</small>
          <small :class="passwordStrength.colorClass">{{ passwordStrength.text }}</small>
        </div>
        <div class="progress" style="height: 4px;">
          <div 
            class="progress-bar" 
            :class="passwordStrength.colorClass.replace('text-', 'bg-')"
            :style="{ width: passwordStrength.percentage + '%' }"
            role="progressbar"></div>
        </div>
      </div>

      <!-- Password Requirements -->
      <div v-if="internalValue && showRequirements" class="mt-3">
        <small class="text-muted d-block mb-2">Şifre Gereksinimleri:</small>
        <div class="row g-2">
          <div class="col-6">
            <div class="d-flex align-items-center">
              <i :class="requirements.minLength.valid ? 'bi bi-check-circle text-success' : 'bi bi-x-circle text-danger'" class="me-2"></i>
              <small :class="requirements.minLength.valid ? 'text-success' : 'text-muted'">En az 8 karakter</small>
            </div>
          </div>
          <div class="col-6">
            <div class="d-flex align-items-center">
              <i :class="requirements.uppercase.valid ? 'bi bi-check-circle text-success' : 'bi bi-x-circle text-danger'" class="me-2"></i>
              <small :class="requirements.uppercase.valid ? 'text-success' : 'text-muted'">Büyük harf (A-Z)</small>
            </div>
          </div>
          <div class="col-6">
            <div class="d-flex align-items-center">
              <i :class="requirements.lowercase.valid ? 'bi bi-check-circle text-success' : 'bi bi-x-circle text-danger'" class="me-2"></i>
              <small :class="requirements.lowercase.valid ? 'text-success' : 'text-muted'">Küçük harf (a-z)</small>
            </div>
          </div>
          <div class="col-6">
            <div class="d-flex align-items-center">
              <i :class="requirements.number.valid ? 'bi bi-check-circle text-success' : 'bi bi-x-circle text-danger'" class="me-2"></i>
              <small :class="requirements.number.valid ? 'text-success' : 'text-muted'">Rakam (0-9)</small>
            </div>
          </div>
          <div v-if="requireSpecialChar" class="col-12">
            <div class="d-flex align-items-center">
              <i :class="requirements.special.valid ? 'bi bi-check-circle text-success' : 'bi bi-x-circle text-danger'" class="me-2"></i>
              <small :class="requirements.special.valid ? 'text-success' : 'text-muted'">Özel karakter (!@#$%^&* vb.)</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Strength Warning -->
      <div v-if="internalValue && showStrengthIndicator && passwordStrength.score < minStrengthScore" class="alert alert-warning py-2 px-3 mt-2">
        <i class="bi bi-exclamation-triangle me-2"></i>
        <small>Güvenlik için daha güçlü bir şifre seçiniz.</small>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  fieldId: string
  label: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  errorMessage?: string
  showStrengthIndicator?: boolean
  showRequirements?: boolean
  requireSpecialChar?: boolean
  minStrengthScore?: number
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'input', value: string): void
  (e: 'blur', value: string): void
  (e: 'validation-change', data: { 
    isValid: boolean, 
    score: number, 
    requirements: any,
    strength: any 
  }): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Şifrenizi girin',
  required: true,
  disabled: false,
  errorMessage: '',
  showStrengthIndicator: true,
  showRequirements: true,
  requireSpecialChar: true,
  minStrengthScore: 3
})

const emit = defineEmits<Emits>()

// Internal state
const showPassword = ref(false)
const internalValue = ref(props.modelValue)

// Computed
const hasError = computed(() => !!props.errorMessage)

// Password requirements computed
const requirements = computed(() => {
  const password = internalValue.value
  return {
    minLength: {
      valid: password.length >= 8,
      text: 'En az 8 karakter'
    },
    uppercase: {
      valid: /[A-Z]/.test(password),
      text: 'Büyük harf (A-Z)'
    },
    lowercase: {
      valid: /[a-z]/.test(password),
      text: 'Küçük harf (a-z)'
    },
    number: {
      valid: /\d/.test(password),
      text: 'Rakam (0-9)'
    },
    special: {
      valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password),
      text: 'Özel karakter'
    }
  }
})

// Password strength computed
const passwordStrength = computed(() => {
  const password = internalValue.value
  if (!password) {
    return { score: 0, text: '', colorClass: '', percentage: 0 }
  }

  let score = 0
  const reqs = requirements.value

  // Calculate score based on requirements
  if (reqs.minLength.valid) score++
  if (reqs.uppercase.valid) score++
  if (reqs.lowercase.valid) score++
  if (reqs.number.valid) score++
  if (reqs.special.valid && props.requireSpecialChar) score++

  // Additional complexity checks
  if (password.length >= 12) score += 0.5
  if (password.length >= 16) score += 0.5

  const maxScore = props.requireSpecialChar ? 6 : 5
  const percentage = Math.round((score / maxScore) * 100)

  let text = ''
  let colorClass = ''

  if (score <= 2) {
    text = 'Çok Zayıf'
    colorClass = 'text-danger'
  } else if (score <= 3) {
    text = 'Zayıf'
    colorClass = 'text-warning'
  } else if (score <= 4) {
    text = 'Orta'
    colorClass = 'text-info'
  } else if (score <= 5) {
    text = 'Güçlü'
    colorClass = 'text-success'
  } else {
    text = 'Çok Güçlü'
    colorClass = 'text-success'
  }

  return { score, text, colorClass, percentage }
})

// Password validation computed
const isPasswordValid = computed(() => {
  const reqs = requirements.value
  let isValid = reqs.minLength.valid && reqs.uppercase.valid && 
                reqs.lowercase.valid && reqs.number.valid
  
  if (props.requireSpecialChar) {
    isValid = isValid && reqs.special.valid
  }
  
  return isValid && passwordStrength.value.score >= props.minStrengthScore
})

// Watchers
watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue
})

watch(internalValue, (newValue) => {
  emit('update:modelValue', newValue)
  
  // Emit validation status
  emit('validation-change', {
    isValid: isPasswordValid.value,
    score: passwordStrength.value.score,
    requirements: requirements.value,
    strength: passwordStrength.value
  })
})

// Methods
const onInput = () => {
  emit('input', internalValue.value)
}

const onBlur = () => {
  emit('blur', internalValue.value)
}
</script>

<style scoped>
.password-field .progress-bar {
  transition: width 0.3s ease, background-color 0.3s ease;
}
</style> 