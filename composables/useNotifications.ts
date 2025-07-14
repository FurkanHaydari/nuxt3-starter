export function useNotifications() {
  const showErrorModal = ref(false)
  const showSuccessModal = ref(false)

  const errorModal = reactive({
    title: 'Bir Hata Oluştu',
    message: '',
    showRetry: false
  })

  const successModal = reactive({
    title: 'Başarılı',
    message: '',
    showAction: false,
    actionText: ''
  })

  let lastAction: (() => Promise<void>) | null = null

  const showError = (message: string, title?: string, showRetry: boolean = false) => {
    errorModal.title = title || 'Bir Hata Oluştu'
    errorModal.message = message
    errorModal.showRetry = showRetry
    showErrorModal.value = true
  }

  const showSuccess = (message: string, title?: string, showAction: boolean = false, actionText: string = '') => {
    successModal.title = title || 'Başarılı'
    successModal.message = message
    successModal.showAction = showAction
    successModal.actionText = actionText
    showSuccessModal.value = true
  }

  const closeErrorModal = () => {
    showErrorModal.value = false
    errorModal.showRetry = false
  }

  const closeSuccessModal = () => {
    showSuccessModal.value = false
    successModal.showAction = false
  }

  const setLastAction = (action: (() => Promise<void>) | null) => {
    lastAction = action
  }

  const retryLastAction = async () => {
    if (lastAction) {
      closeErrorModal()
      await lastAction()
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
