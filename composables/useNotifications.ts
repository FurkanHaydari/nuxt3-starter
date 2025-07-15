export function useNotifications() {
  // Use Nuxt's global state management
  const showErrorModal = useState('showErrorModal', () => false)
  const showSuccessModal = useState('showSuccessModal', () => false)

  const errorModal = useState('errorModal', () => ({
    title: 'Bir Hata Oluştu',
    message: '',
    showRetry: false
  }))

  const successModal = useState('successModal', () => ({
    title: 'Başarılı',
    message: '',
    showAction: false,
    actionText: '',
    action: null as (() => void) | null
  }))

  // Use global state for lastAction too
  const lastAction = useState<(() => Promise<void>) | null>('lastAction', () => null)

  const showError = (message: string, title?: string, showRetry: boolean = false) => {
    console.log('showError called with:', { message, title, showRetry })
    errorModal.value.title = title || 'Bir Hata Oluştu'
    errorModal.value.message = message
    errorModal.value.showRetry = showRetry
    showErrorModal.value = true
    console.log('Modal state after showError:', { showErrorModal: showErrorModal.value, errorModal: errorModal.value })
  }

  const showSuccess = (message: string, title?: string, showAction: boolean = false, actionText: string = '', action?: () => void) => {
    successModal.value.title = title || 'Başarılı'
    successModal.value.message = message
    successModal.value.showAction = showAction
    successModal.value.actionText = actionText
    successModal.value.action = action || null
    showSuccessModal.value = true
  }

  const closeErrorModal = () => {
    showErrorModal.value = false
    errorModal.value.showRetry = false
  }

  const closeSuccessModal = () => {
    showSuccessModal.value = false
    successModal.value.showAction = false
    successModal.value.action = null
  }

  const setLastAction = (action: (() => Promise<void>) | null) => {
    lastAction.value = action
  }

  const retryLastAction = async () => {
    if (lastAction.value) {
      closeErrorModal()
      await lastAction.value()
    }
  }

  return {
    // State
    showErrorModal: readonly(showErrorModal),
    showSuccessModal: readonly(showSuccessModal),
    errorModal: readonly(errorModal),
    successModal: readonly(successModal),
    
    // Methods
    showError,
    showSuccess,
    closeErrorModal,
    closeSuccessModal,
    setLastAction,
    retryLastAction
  }
}
