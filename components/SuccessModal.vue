<template>
  <div v-if="show" class="success-modal-overlay" @click="closeModal">
    <div class="success-modal" @click.stop>
      <div class="success-modal-header">
        <div class="success-icon">
          <i class="bi bi-check-circle-fill"></i>
        </div>
        <h4 class="success-title">{{ title }}</h4>
        <button type="button" class="close-btn" @click="closeModal">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      
      <div class="success-modal-body">
        <p class="success-message">{{ message }}</p>
        
        <div v-if="details && details.length > 0" class="success-details">
          <h6>Detaylar:</h6>
          <ul>
            <li v-for="detail in details" :key="detail">{{ detail }}</li>
          </ul>
        </div>
      </div>
      
      <div class="success-modal-footer">
        <button type="button" class="btn btn-success" @click="closeModal">
          <i class="bi bi-check-lg me-2"></i>
          Tamam
        </button>
        <button v-if="showAction" type="button" class="btn btn-outline-success ms-2" @click="action">
          <i class="bi bi-arrow-right me-2"></i>
          {{ actionText }}
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
  showAction?: boolean
  actionText?: string
}

interface Emits {
  (e: 'close'): void
  (e: 'action'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Başarılı!',
  details: () => [],
  showAction: false,
  actionText: 'Devam Et'
})

const emit = defineEmits<Emits>()

const closeModal = () => {
  emit('close')
}

const action = () => {
  emit('action')
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
.success-modal-overlay {
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
  z-index: 1050;
  animation: fadeIn 0.3s ease;
}

.success-modal {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

.success-modal-header {
  padding: 24px 24px 16px;
  border-bottom: 1px solid #e9ecef;
  position: relative;
  text-align: center;
}

.success-icon {
  background: linear-gradient(135deg, #28a745, #20c997);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  box-shadow: 0 8px 20px rgba(40, 167, 69, 0.3);
}

.success-icon i {
  font-size: 28px;
  color: white;
}

.success-title {
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

.success-modal-body {
  padding: 16px 24px;
}

.success-message {
  color: #495057;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0 0 16px;
  text-align: center;
}

.success-details {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #28a745;
}

.success-details h6 {
  color: #495057;
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.success-details ul {
  margin: 0;
  padding-left: 16px;
}

.success-details li {
  color: #6c757d;
  font-size: 0.875rem;
  margin-bottom: 4px;
}

.success-modal-footer {
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
  .success-modal {
    background: #2b3035;
    color: white;
  }
  
  .success-modal-header {
    border-bottom-color: #495057;
  }
  
  .success-title {
    color: white;
  }
  
  .success-message {
    color: #e9ecef;
  }
  
  .success-details {
    background: #343a40;
  }
  
  .success-details h6 {
    color: #e9ecef;
  }
  
  .success-details li {
    color: #ced4da;
  }
  
  .close-btn:hover {
    background: #495057;
    color: #e9ecef;
  }
}

/* Mobile responsiveness */
@media (max-width: 576px) {
  .success-modal {
    margin: 16px;
    width: calc(100% - 32px);
  }
  
  .success-modal-header,
  .success-modal-body,
  .success-modal-footer {
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