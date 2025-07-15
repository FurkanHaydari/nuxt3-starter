<template>
  <div v-if="show" class="error-modal-overlay" @click="closeModal">
    <div class="error-modal" @click.stop>
      <div class="error-modal-header">
        <div class="error-icon">
          <i class="bi bi-exclamation-triangle-fill"></i>
        </div>
        <h4 class="error-title">{{ title }}</h4>
        <button type="button" class="close-btn" @click="closeModal">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      
      <div class="error-modal-body">
        <p class="error-message">{{ message }}</p>
        
        <div v-if="details && details.length > 0" class="error-details">
          <h6>Detaylar:</h6>
          <ul>
            <li v-for="detail in details" :key="detail">{{ detail }}</li>
          </ul>
        </div>
      </div>
      
      <div class="error-modal-footer">
        <button type="button" class="btn btn-primary" @click="closeModal">
          <i class="bi bi-check-lg me-2"></i>
          Anladım
        </button>
        <button v-if="showRetry" type="button" class="btn btn-outline-primary ms-2" @click="retry">
          <i class="bi bi-arrow-clockwise me-2"></i>
          Tekrar Dene
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  title?: string
  message: string
  details?: string[]
  showRetry?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'retry'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Bir Hata Oluştu',
  details: () => [],
  showRetry: false
})

const emit = defineEmits<Emits>()

// Debug props
watch(() => props.show, (newVal) => {
  console.log('ErrorModal show prop changed:', newVal, props)
})

const closeModal = () => {
  emit('close')
}

const retry = () => {
  emit('retry')
}

// Auto close on Escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.show) {
      closeModal()
    }
  }
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>

<style scoped>
.error-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.error-modal {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

.error-modal-header {
  padding: 24px 24px 16px;
  border-bottom: 1px solid #e9ecef;
  position: relative;
  text-align: center;
}

.error-icon {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  box-shadow: 0 8px 20px rgba(238, 90, 82, 0.3);
}

.error-icon i {
  font-size: 28px;
  color: white;
}

.error-title {
  margin: 0;
  color: #2c3e50;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: #6c757d;
  font-size: 18px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f8f9fa;
  color: #495057;
}

.error-modal-body {
  padding: 16px 24px;
}

.error-message {
  color: #495057;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0 0 16px;
  text-align: center;
}

.error-details {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #ff6b6b;
}

.error-details h6 {
  color: #495057;
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.error-details ul {
  margin: 0;
  padding-left: 16px;
}

.error-details li {
  color: #6c757d;
  font-size: 0.875rem;
  margin-bottom: 4px;
}

.error-modal-footer {
  padding: 16px 24px 24px;
  text-align: center;
}

.btn {
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
  text-transform: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .error-modal {
    background: #2b3035;
    color: white;
  }
  
  .error-modal-header {
    border-bottom-color: #495057;
  }
  
  .error-title {
    color: white;
  }
  
  .error-message {
    color: #e9ecef;
  }
  
  .error-details {
    background: #343a40;
  }
  
  .error-details h6 {
    color: #e9ecef;
  }
  
  .error-details li {
    color: #ced4da;
  }
  
  .close-btn:hover {
    background: #495057;
    color: #e9ecef;
  }
}

/* Mobile responsiveness */
@media (max-width: 576px) {
  .error-modal {
    margin: 16px;
    width: calc(100% - 32px);
  }
  
  .error-modal-header,
  .error-modal-body,
  .error-modal-footer {
    padding-left: 20px;
    padding-right: 20px;
  }
  
  .btn {
    width: 100%;
    margin-bottom: 8px;
  }
  
  .btn.ms-2 {
    margin-left: 0 !important;
  }
}
</style> 