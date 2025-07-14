<template>
  <div class="mb-3">
    <label :for="fieldId" class="form-label">Meslek <span v-if="required" class="text-danger">*</span></label>
    <div class="position-relative">
      <input 
        type="text" 
        class="form-control" 
        :id="fieldId"
        v-model="searchText"
        @input="filterProfessions"
        @focus="showDropdown = true"
        @blur="hideDropdown"
        :class="{ 'is-invalid': frontendError || backendError }"
        placeholder="Mesleğinizi arayın..."
        autocomplete="off"
        :required="required">
      
      <div v-if="showDropdown && filteredProfessions.length > 0" 
           class="dropdown-menu show position-absolute w-100" 
           style="max-height: 200px; overflow-y: auto; z-index: 1050;">
        <button 
          v-for="profession in filteredProfessions" 
          :key="profession.id" 
          type="button"
          class="dropdown-item"
          @mousedown="selectProfession(profession)">
          {{ profession.name }}
        </button>
      </div>
    </div>
    <div v-if="frontendError" class="invalid-feedback d-block">
      <i class="bi bi-exclamation-circle me-1"></i>{{ frontendError }}
    </div>
    <div v-if="backendError && !frontendError" class="invalid-feedback d-block">
      <i class="bi bi-exclamation-circle me-1"></i>{{ backendError }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number
  fieldId: string
  required?: boolean
  variant?: 'searchable' | 'dropdown'
  frontendError?: string
  backendError?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'blur'): void
  (e: 'selection-changed', profession: {id: number, name: string} | null): void
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  variant: 'searchable',
  frontendError: '',
  backendError: ''
})

const emit = defineEmits<Emits>()

const { professions, loadProfessions, searchProfessions } = useProfessions()

const searchText = ref('')
const showDropdown = ref(false)

const filteredProfessions = computed(() => {
  return searchProfessions(searchText.value).slice(0, 10)
})

// Load profession name when modelValue changes
watch(() => props.modelValue, (newValue) => {
  if (newValue && professions.value.length > 0) {
    const profession = professions.value.find(p => p.id.toString() === newValue.toString())
    if (profession) {
      searchText.value = profession.name
    }
  }
}, { immediate: true })

const filterProfessions = () => {
  showDropdown.value = true
}

const selectProfession = (profession: {id: number, name: string}) => {
  emit('update:modelValue', profession.id.toString())
  searchText.value = profession.name
  showDropdown.value = false
  emit('selection-changed', profession)
  emit('blur')
}

const hideDropdown = () => {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
  emit('blur')
}

// Load professions on mount
onMounted(async () => {
  await loadProfessions()
})
</script>
