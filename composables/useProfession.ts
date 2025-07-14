// Global profession state - singleton pattern
const globalProfessionState = {
  professions: ref<Array<{id: number, name: string}>>([]),
  filteredProfessions: ref<Array<{id: number, name: string}>>([]),
  professionSearch: ref(''),
  showProfessionDropdown: ref(false),
  professionsLoading: ref(false),
  selectedProfessionId: ref(''),
  isInitialized: ref(false)
}

export const useProfession = () => {
  // Use global state
  const {
    professions,
    filteredProfessions,
    professionSearch,
    showProfessionDropdown,
    professionsLoading,
    selectedProfessionId,
    isInitialized
  } = globalProfessionState

  // API instance
  const api = useApi()

  // Load professions from API
  const loadProfessions = async () => {
    // If already loaded, return success
    if (isInitialized.value && professions.value.length > 0) {
      return { success: true }
    }
    
    // If already loading, wait for it to complete
    if (professionsLoading.value) {
      return new Promise<{success: boolean, error?: string, details?: string[]}>((resolve) => {
        const checkLoading = () => {
          if (!professionsLoading.value) {
            resolve(isInitialized.value ? { success: true } : { 
              success: false, 
              error: 'Meslekler yüklenemedi. Lütfen sayfayı yenileyin.' 
            })
          } else {
            setTimeout(checkLoading, 100)
          }
        }
        checkLoading()
      })
    }
    
    professionsLoading.value = true
    try {
      console.log('Making API call to load professions...')
      const response = await api.profession.getProfessions()
      console.log('API response:', response)
      
      if (response.isSuccess && response.data && Array.isArray(response.data)) {
        professions.value = response.data.map(p => ({ 
          id: p.id, 
          name: p.name 
        })).sort((a, b) => a.name.localeCompare(b.name, 'tr', { sensitivity: 'base' }))
        
        filteredProfessions.value = professions.value.slice(0, 20) // Show first 20 initially
        isInitialized.value = true
        console.log(`${professions.value.length} meslek yüklendi`)
        return { success: true }
      } else {
        console.error('Failed to load professions:', response.error || 'Invalid response format')
        console.error('Response details:', response)
        professions.value = []
        filteredProfessions.value = []
        isInitialized.value = false
        return { 
          success: false, 
          error: 'Meslekler yüklenemedi. Lütfen sayfayı yenileyin.',
          details: response.error ? [response.error] : []
        }
      }
    } catch (error) {
      console.error('Error loading professions:', error)
      professions.value = []
      filteredProfessions.value = []
      isInitialized.value = false
      return { 
        success: false, 
        error: 'Meslekler yüklenirken hata oluştu. Lütfen sayfayı yenileyin.',
        details: error instanceof Error ? [error.message] : []
      }
    } finally {
      professionsLoading.value = false
    }
  }

  // Filter professions based on search term
  const filterProfessions = () => {
    const searchTerm = professionSearch.value.toLowerCase().trim()
    
    if (searchTerm.length === 0) {
      // Show first 20 when no search term
      filteredProfessions.value = professions.value.slice(0, 20)
    } else if (searchTerm.length < 2) {
      // Show fewer results for short searches
      filteredProfessions.value = professions.value
        .filter(p => p.name.toLowerCase().startsWith(searchTerm))
        .slice(0, 10)
    } else {
      // Full search for longer terms
      filteredProfessions.value = professions.value
        .filter(p => 
          p.name.toLowerCase().includes(searchTerm) ||
          // Also search for exact matches at word boundaries
          p.name.toLowerCase().split(' ').some(word => word.startsWith(searchTerm))
        )
        .slice(0, 50) // Show more results for specific searches
    }
  }

  // Select a profession
  const selectProfession = (profession: {id: number, name: string}) => {
    selectedProfessionId.value = profession.id.toString()
    professionSearch.value = profession.name
    showProfessionDropdown.value = false
    return profession
  }

  // Hide dropdown with delay
  const hideProfessionDropdown = () => {
    setTimeout(() => {
      showProfessionDropdown.value = false
    }, 200) // Delay to allow click events
  }

  // Show dropdown
  const showDropdown = () => {
    showProfessionDropdown.value = true
  }

  // Get profession name by ID
  const getProfessionNameById = (id: string | number) => {
    const profession = professions.value.find(p => p.id.toString() === id.toString())
    return profession?.name || ''
  }

  // Set profession by ID (useful for editing)
  const setProfessionById = (id: string | number) => {
    const profession = professions.value.find(p => p.id.toString() === id.toString())
    if (profession) {
      selectedProfessionId.value = profession.id.toString()
      professionSearch.value = profession.name
    }
  }

  // Clear selection
  const clearSelection = () => {
    selectedProfessionId.value = ''
    professionSearch.value = ''
    showProfessionDropdown.value = false
  }

  // Computed - has valid selection
  const hasValidSelection = computed(() => {
    return selectedProfessionId.value !== '' && 
           professions.value.some(p => p.id.toString() === selectedProfessionId.value)
  })

  return {
    // States
    professions: readonly(professions),
    filteredProfessions: readonly(filteredProfessions),
    professionSearch,
    showProfessionDropdown: readonly(showProfessionDropdown),
    professionsLoading: readonly(professionsLoading),
    selectedProfessionId: readonly(selectedProfessionId),
    
    // Computed
    hasValidSelection,
    
    // Methods
    loadProfessions,
    filterProfessions,
    selectProfession,
    hideProfessionDropdown,
    showDropdown,
    getProfessionNameById,
    setProfessionById,
    clearSelection
  }
}
