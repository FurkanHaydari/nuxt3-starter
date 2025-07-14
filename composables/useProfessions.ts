export interface Profession {
  id: number
  name: string
}

export function useProfessions() {
  const professions = ref<Profession[]>([])
  const loading = ref(false)
  const error = ref('')

  const loadProfessions = async () => {
    try {
      loading.value = true
      error.value = ''
      
      // API call to get professions
      const api = useApi()
      const response = await api.profession.getProfessions()
      
      if (response.isSuccess && response.data) {
        professions.value = response.data
      } else {
        throw new Error(response.message || 'Meslekler yüklenemedi')
      }
    } catch (err: any) {
      error.value = err.message || 'Meslekler yüklenirken hata oluştu'
      console.error('Error loading professions:', err)
    } finally {
      loading.value = false
    }
  }

  const searchProfessions = (query: string): Profession[] => {
    if (!query.trim()) return professions.value
    
    return professions.value.filter(profession =>
      profession.name.toLowerCase().includes(query.toLowerCase())
    )
  }

  return {
    professions: readonly(professions),
    loading: readonly(loading),
    error: readonly(error),
    loadProfessions,
    searchProfessions
  }
}
