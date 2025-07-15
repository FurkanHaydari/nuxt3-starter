export function useErrorHandling() {
  const { showError, showSuccess, setLastAction } = useNotifications()

  // Frontend validation errors state
  const fieldErrors = ref<Record<string, string>>({})
  const hasFieldErrors = computed(() => Object.values(fieldErrors.value).some(error => error !== ''))

  // Set a field error
  const setFieldError = (field: string, error: string) => {
    fieldErrors.value[field] = error
  }

  // Clear a specific field error
  const clearFieldError = (field: string) => {
    fieldErrors.value[field] = ''
  }

  // Clear all field errors
  const clearAllFieldErrors = () => {
    Object.keys(fieldErrors.value).forEach(key => {
      fieldErrors.value[key] = ''
    })
  }

  // Get field error
  const getFieldError = (field: string): string => {
    return fieldErrors.value[field] || ''
  }

  // Handle backend errors (show in modal)
  const handleBackendError = (error: string, title?: string, showRetry: boolean = true, retryAction?: () => Promise<void>) => {
    console.log('handleBackendError called with:', { error, title, showRetry })
    if (retryAction) {
      setLastAction(retryAction)
    }
    showError(error, title, showRetry)
  }

  // Handle success (show in modal)
  const handleSuccess = (message: string, title?: string, showAction: boolean = false, actionText?: string, action?: () => void) => {
    showSuccess(message, title, showAction, actionText, action)
  }

  // Validate a field and set error if invalid
  const validateField = (field: string, value: any, validator: (value: any) => { isValid: boolean; error?: string }) => {
    const result = validator(value)
    setFieldError(field, result.isValid ? '' : result.error || '')
    return result.isValid
  }

  // Scroll to first error field
  const scrollToFirstError = () => {
    nextTick(() => {
      const firstErrorField = document.querySelector('.is-invalid, .form-control[class*="invalid"]')
      if (firstErrorField) {
        firstErrorField.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
        // Focus the field if it's an input
        if (firstErrorField instanceof HTMLElement && (firstErrorField.tagName === 'INPUT' || firstErrorField.tagName === 'TEXTAREA' || firstErrorField.tagName === 'SELECT')) {
          firstErrorField.focus()
        }
      }
    })
  }

  // Handle form validation - returns true if valid
  const validateForm = (validationRules: Record<string, () => boolean>): boolean => {
    let isValid = true
    
    // Run all validations
    Object.entries(validationRules).forEach(([field, validator]) => {
      if (!validator()) {
        isValid = false
      }
    })

    // Scroll to first error if validation failed
    if (!isValid) {
      scrollToFirstError()
    }

    return isValid
  }

  // Handle input changes (clear error while typing)
  const handleInputChange = (field: string, value: any) => {
    if (getFieldError(field) && value && value.toString().length > 0) {
      clearFieldError(field)
    }
  }

  return {
    // State
    fieldErrors: readonly(fieldErrors),
    hasFieldErrors,

    // Field error methods
    setFieldError,
    clearFieldError,
    clearAllFieldErrors,
    getFieldError,

    // Validation methods
    validateField,
    validateForm,
    scrollToFirstError,

    // Input handling
    handleInputChange,

    // Backend error/success handling
    handleBackendError,
    handleSuccess
  }
}
