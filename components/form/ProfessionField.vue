<template>
  <div class="mb-3">
    <label :for="fieldId" class="form-label">
      Meslek 
      <span v-if="required" class="text-danger">*</span>
    </label>
    
    <!-- Simple select for profile page -->
    <select 
      v-if="variant === 'select'"
      :id="fieldId"
      class="form-select"
      :value="modelValue"
      @change="onSelectChange"
      @blur="onBlur"
      :class="{ 'is-invalid': hasError }"
      :disabled="professionsLoading">
      
      <option value="">Meslek seçiniz...</option>
      <option 
        v-for="profession in professions" 
        :key="profession.id" 
        :value="profession.id">
        {{ profession.name }}
      </option>
    </select>
    
    <!-- Searchable dropdown for register page -->
    <div v-else class="position-relative">
      <input 
        type="text" 
        class="form-control" 
        :id="fieldId" 
        v-model="professionSearch"
        @input="filterProfessions"
        @focus="showDropdown"
        @blur="hideProfessionDropdown"
        :class="{ 'is-invalid': hasError }"
        placeholder="Mesleğinizi arayın veya seçin..."
        autocomplete="off"
        :required="required">
      
      <!-- Loading Spinner -->
      <div v-if="professionsLoading" class="position-absolute top-50 end-0 translate-middle-y me-3">
        <div class="spinner-border spinner-border-sm text-primary" role="status">
          <span class="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
      
      <!-- Dropdown Icon -->
      <div v-else class="position-absolute top-50 end-0 translate-middle-y me-3">
        <i class="bi bi-chevron-down text-muted"></i>
      </div>
      
      <!-- Dropdown Menu -->
      <div v-if="showProfessionDropdown && !professionsLoading" 
           class="dropdown-menu show position-absolute w-100 mt-1 shadow-lg border-0" 
           style="max-height: 250px; overflow-y: auto; z-index: 1050;">
        
        <!-- No results -->
        <div v-if="filteredProfessions.length === 0" class="dropdown-item-text text-muted text-center py-3">
          <i class="bi bi-search me-2"></i>
          Arama sonucu bulunamadı
        </div>
        
        <!-- Profession items -->
        <button 
          v-for="profession in filteredProfessions" 
          :key="profession.id" 
          type="button"
          class="dropdown-item d-flex align-items-center py-2 px-3"
          :class="{ 'active': selectedProfessionId === profession.id.toString() }"
          @mousedown="onProfessionSelect(profession)">
          <i class="bi bi-briefcase me-2 text-primary"></i>
          <span>{{ profession.name }}</span>
          <i v-if="selectedProfessionId === profession.id.toString()" 
             class="bi bi-check-lg ms-auto text-success"></i>
        </button>
      </div>
    </div>
    
    <!-- Frontend Error -->
    <div v-if="frontendError" class="invalid-feedback d-block">
      <i class="bi bi-exclamation-circle me-1"></i>{{ frontendError }}
    </div>
    
    <!-- Backend Error -->
    <div v-if="backendError" class="invalid-feedback text-warning d-block">
      <i class="bi bi-server me-1"></i>{{ backendError }} <small>(Backend)</small>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number
  fieldId?: string
  required?: boolean
  variant?: 'select' | 'searchable'
  frontendError?: string
  backendError?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'blur'): void
  (e: 'selection-changed', profession: {id: number, name: string} | null): void
}

const props = withDefaults(defineProps<Props>(), {
  fieldId: 'profession',
  required: false,
  variant: 'searchable',
  frontendError: '',
  backendError: ''
})

const emit = defineEmits<Emits>()

// Use profession composable
const {
  professions,
  filteredProfessions,
  professionSearch,
  showProfessionDropdown,
  professionsLoading,
  selectedProfessionId,
  loadProfessions,
  filterProfessions,
  selectProfession,
  hideProfessionDropdown,
  showDropdown,
  setProfessionById,
  getProfessionNameById
} = useProfession()

// Computed
const hasError = computed(() => {
  return Boolean(props.frontendError || props.backendError)
})

// Initialize profession field if modelValue is provided
watch(() => props.modelValue, (newValue) => {
  if (newValue && newValue !== selectedProfessionId.value) {
    setProfessionById(newValue)
  }
}, { immediate: true })

// Watch for profession selection changes and emit to parent
watch(selectedProfessionId, (newId) => {
  if (newId && newId !== props.modelValue.toString()) {
    emit('update:modelValue', newId)
    
    const profession = professions.value.find(p => p.id.toString() === newId)
    emit('selection-changed', profession || null)
  }
})

// Methods
const onSelectChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = target.value
  
  emit('update:modelValue', value)
  
  if (value) {
    setProfessionById(value)
    const profession = professions.value.find(p => p.id.toString() === value)
    emit('selection-changed', profession || null)
  } else {
    emit('selection-changed', null)
  }
}

const onProfessionSelect = (profession: {id: number, name: string}) => {
  selectProfession(profession)
  emit('update:modelValue', profession.id.toString())
  emit('selection-changed', profession)
}

const onBlur = () => {
  emit('blur')
}

// Initialize on mount
onMounted(async () => {
  console.log('ProfessionField mounted, professions count:', professions.value.length)
  
  // Always try to load professions (singleton will handle if already loaded)
  const result = await loadProfessions()
  if (!result.success) {
    console.error('Failed to load professions:', result.error)
  }
  
  // Set initial value if provided
  if (props.modelValue) {
    console.log('Setting initial profession value:', props.modelValue)
    setProfessionById(props.modelValue)
  }
})
</script>

<style scoped>
.invalid-feedback.text-warning {
  color: #ff8c00 !important;
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 0.25rem;
  padding: 0.375rem 0.75rem;
  margin-top: 0.25rem;
}

.invalid-feedback.text-warning i {
  color: #ff8c00 !important;
}

.invalid-feedback.text-warning small {
  font-size: 0.75rem;
  opacity: 0.8;
}

/* Profession Dropdown Styles */
.dropdown-menu {
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.dropdown-item {
  border: none;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #495057;
}

.dropdown-item.active {
  background-color: #e3f2fd;
  color: #1976d2;
}

.dropdown-item:focus {
  background-color: #e3f2fd;
  color: #1976d2;
  outline: none;
}

.dropdown-item-text {
  font-size: 0.85rem;
}

/* Input with icon styling */
.form-control:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
}

/* Loading spinner in input */
.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}
</style>
