import { reactive, computed } from 'vue'

export interface ValidationRule {
  required?: boolean
  email?: boolean
  minLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
}

export interface ValidationSchema {
  [key: string]: ValidationRule
}

export function useFormValidation<T extends Record<string, any>>(
  form: T,
  schema: ValidationSchema
) {
  const errors = reactive<Record<string, string>>({})
  const hasInteracted = reactive<Record<string, boolean>>({})

  const clearErrors = () => {
    Object.keys(errors).forEach(key => {
      errors[key] = ''
    })
  }

  const validateField = (field: keyof T): boolean => {
    const fieldName = String(field)
    const value = form[field]
    const rule = schema[fieldName]
    
    if (!rule) return true

    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      errors[fieldName] = `${fieldName} girilmesi zorunludur`
      return false
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && !value.trim())) {
      errors[fieldName] = ''
      return true
    }

    // Email validation
    if (rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[fieldName] = 'Geçerli bir e-posta adresi giriniz'
      return false
    }

    // Min length validation
    if (rule.minLength && value.length < rule.minLength) {
      errors[fieldName] = `En az ${rule.minLength} karakter olmalıdır`
      return false
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      errors[fieldName] = 'Geçerli format giriniz'
      return false
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value)
      if (customError) {
        errors[fieldName] = customError
        return false
      }
    }

    errors[fieldName] = ''
    return true
  }

  const validate = (): boolean => {
    let isValid = true
    
    Object.keys(schema).forEach(field => {
      if (!validateField(field as keyof T)) {
        isValid = false
      }
    })

    return isValid
  }

  const markAllAsInteracted = () => {
    Object.keys(schema).forEach(field => {
      hasInteracted[field] = true
    })
  }

  const getFieldError = (field: keyof T) => {
    const fieldName = String(field)
    return hasInteracted[fieldName] ? errors[fieldName] : ''
  }

  const hasFieldError = (field: keyof T) => {
    const fieldName = String(field)
    return !!(hasInteracted[fieldName] && errors[fieldName])
  }

  const validationErrors = computed(() => {
    return Object.keys(errors)
      .filter(field => hasInteracted[field] && errors[field])
      .map(field => errors[field])
  })

  return {
    errors,
    hasInteracted,
    clearErrors,
    validate,
    validateField,
    markAllAsInteracted,
    getFieldError,
    hasFieldError,
    validationErrors
  }
}
