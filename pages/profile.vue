<template>
  <div class="min-vh-100 bg-light">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <!-- Profile Header -->
          <div class="card shadow-sm border-0 rounded-3 mb-4">
            <div class="card-body p-4">
              <div class="row align-items-center">
                <div class="col-auto">
                  <div class="avatar-lg bg-primary text-white rounded-circle d-flex align-items-center justify-content-center">
                    <i class="bi bi-person-fill" style="font-size: 2rem;"></i>
                  </div>
                </div>
                <div class="col">
                  <h3 class="mb-1">{{ user?.firstName }} {{ user?.lastName }}</h3>
                  <p class="text-muted mb-1">@{{ user?.username }}</p>
                  <p class="text-muted mb-0">
                    <i class="bi bi-envelope me-2"></i>{{ user?.email }}
                  </p>
                  <p class="text-muted mb-0">
                    <i class="bi bi-telephone me-2"></i>{{ user?.phoneNumber }}
                  </p>
                </div>
                <div class="col-auto">
                  <span class="badge bg-success fs-6">
                    <i class="bi bi-check-circle me-1"></i>
                    Aktif
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Information -->
          <div class="card shadow-sm border-0 rounded-3 mb-4">
            <div class="card-header bg-white border-bottom-0 p-4">
              <h5 class="mb-0">
                <i class="bi bi-person-lines-fill me-2 text-primary"></i>
                Kişisel Bilgiler
              </h5>
            </div>
            <div class="card-body p-4">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label text-muted fw-bold">TC Kimlik No</label>
                  <div class="form-control-plaintext bg-light p-3 rounded border">
                    {{ profileData?.tckn || '-' }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label text-muted fw-bold">Üye No</label>
                  <div class="form-control-plaintext bg-light p-3 rounded border">
                    {{ profileData?.memberNumber || '-' }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label text-muted fw-bold">Ad</label>
                  <div class="form-control-plaintext bg-light p-3 rounded border">
                    {{ profileData?.firstName || user?.firstName || '-' }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label text-muted fw-bold">Soyad</label>
                  <div class="form-control-plaintext bg-light p-3 rounded border">
                    {{ profileData?.lastName || user?.lastName || '-' }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label text-muted fw-bold">E-posta</label>
                  <div class="form-control-plaintext bg-light p-3 rounded border">
                    {{ profileData?.email || user?.email || '-' }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label text-muted fw-bold">Telefon</label>
                  <div class="form-control-plaintext bg-light p-3 rounded border">
                    {{ profileData?.phoneNumber || user?.phoneNumber || '-' }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label text-muted fw-bold">Doğum Tarihi</label>
                  <div class="form-control-plaintext bg-light p-3 rounded border">
                    {{ formatDate(profileData?.birthDate) }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label text-muted fw-bold">Kayıt Tarihi</label>
                  <div class="form-control-plaintext bg-light p-3 rounded border">
                    {{ formatDate(profileData?.createdAt) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Editable Profile -->
          <div class="card shadow-sm border-0 rounded-3">
            <div class="card-header bg-white border-bottom-0 p-4">
              <h5 class="mb-0">
                <i class="bi bi-pencil-square me-2 text-primary"></i>
                Düzenlenebilir Bilgiler
              </h5>
            </div>
            <div class="card-body p-4">
              <!-- Success Message -->
              <div v-if="successMessage" class="alert alert-success" role="alert">
                <i class="bi bi-check-circle me-2"></i>
                {{ successMessage }}
              </div>

              <!-- Error Message -->
              <div v-if="errorMessage" class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                {{ errorMessage }}
              </div>

              <form @submit.prevent="handleSubmit">
                <div class="row g-3">
                  <!-- Username -->
                  <div class="col-md-6">
                    <label for="username" class="form-label">Kullanıcı Adı</label>
                    <input 
                      v-model="form.username"
                      type="text" 
                      class="form-control" 
                      :class="{ 'is-invalid': usernameError }"
                      id="username" 
                      placeholder="Kullanıcı adınızı girin"
                      :disabled="loading"
                      @input="validateUsernameField"
                      @blur="validateUsernameField">
                    <div v-if="usernameError" class="invalid-feedback">
                      {{ usernameError }}
                    </div>
                  </div>

                  <!-- Profession -->
                  <div class="col-md-6">
                    <FormProfessionField
                      v-model="form.professionId"
                      field-id="profession"
                      :required="false"
                      variant="select"
                      :frontend-error="professionError"
                      @blur="validateProfessionField"
                      @selection-changed="onProfessionSelectionChanged" />
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="mt-4 d-flex gap-2">
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    :disabled="loading || !hasChanges">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    <i v-else class="bi bi-check me-2"></i>
                    {{ loading ? 'Güncelleniyor...' : 'Profili Güncelle' }}
                  </button>
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary"
                    @click="resetForm"
                    :disabled="loading">
                    <i class="bi bi-arrow-clockwise me-2"></i>
                    Sıfırla
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="row mt-4">
            <div class="col-md-6">
              <div class="card border-0 bg-primary bg-opacity-10">
                <div class="card-body text-center p-4">
                  <i class="bi bi-key text-primary mb-3" style="font-size: 2rem;"></i>
                  <h6 class="mb-2">Şifre Güncelle</h6>
                  <p class="text-muted small mb-3">Hesabınızın güvenliği için şifrenizi güncelleyin</p>
                  <NuxtLink to="/auth/change-password" class="btn btn-primary btn-sm">
                    <i class="bi bi-arrow-right me-1"></i>
                    Şifre Güncelle
                  </NuxtLink>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card border-0 bg-success bg-opacity-10">
                <div class="card-body text-center p-4">
                  <i class="bi bi-shield-check text-success mb-3" style="font-size: 2rem;"></i>
                  <h6 class="mb-2">Hesap Güvenliği</h6>
                  <p class="text-muted small mb-3">İki faktörlü kimlik doğrulama ve güvenlik ayarları</p>
                  <button class="btn btn-success btn-sm" disabled>
                    <i class="bi bi-arrow-right me-1"></i>
                    Yakında
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: 'Profil - BetStarter',
  meta: [
    { name: 'description', content: 'Kullanıcı profili ve hesap ayarları' }
  ]
})

// State
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const profileData = ref<any>(null)

// Form data
const form = reactive({
  username: '',
  professionId: ''
})

// Original values for comparison
const originalValues = reactive({
  username: '',
  professionId: ''
})

// Validation errors
const usernameError = ref('')
const professionError = ref('')

// Get user from auth store
const { user, isAuthenticated } = useAuth()

// Computed properties
const hasChanges = computed(() => {
  return form.username !== originalValues.username || 
         form.professionId !== originalValues.professionId
})

// Validation functions
const validateUsernameField = () => {
  if (form.username && form.username.length < 3) {
    usernameError.value = 'Kullanıcı adı en az 3 karakter olmalıdır.'
    return
  }
  
  if (form.username && form.username.length > 50) {
    usernameError.value = 'Kullanıcı adı en fazla 50 karakter olmalıdır.'
    return
  }

  if (form.username && !/^[a-zA-Z0-9_]+$/.test(form.username)) {
    usernameError.value = 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir.'
    return
  }

  usernameError.value = ''
}

const validateProfessionField = () => {
  // Profession is optional, so no validation needed
  professionError.value = ''
}

// Handle profession selection from component
const onProfessionSelectionChanged = (profession: {id: number, name: string} | null) => {
  // Clear any profession-related errors when a valid selection is made
  professionError.value = ''
}

// Helper functions
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '-'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return '-'
  }
}

const resetForm = () => {
  form.username = originalValues.username
  form.professionId = originalValues.professionId
  
  usernameError.value = ''
  professionError.value = ''
  errorMessage.value = ''
  successMessage.value = ''
}

// Load user profile
const loadProfile = async () => {
  try {
    const api = useApi()
    const response = await api.profile.getProfile()
    
    if (response.isSuccess && response.data) {
      const data = response.data
      
      // Store profile data for readonly display
      profileData.value = data
      
      // Update form with API data
      form.username = data.username || ''
      form.professionId = data.profession || ''
      
      // Store original values
      originalValues.username = data.username || ''
      originalValues.professionId = data.profession || ''
      
      console.log('Profile loaded:', data)
    } else {
      // Fallback to auth store data
      form.username = user.value?.username || ''
      form.professionId = user.value?.profession || ''
      
      originalValues.username = user.value?.username || ''
      originalValues.professionId = user.value?.profession || ''
    }
  } catch (error) {
    console.error('Failed to load profile:', error)
    
    // Fallback to auth store data
    form.username = user.value?.username || ''
    form.professionId = user.value?.profession || ''
    
    originalValues.username = user.value?.username || ''
    originalValues.professionId = user.value?.profession || ''
  }
}

// Form submission
const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  // Validation
  validateUsernameField()
  validateProfessionField()
  
  if (usernameError.value || professionError.value) {
    return
  }

  if (!hasChanges.value) {
    errorMessage.value = 'Değişiklik yapılmadı.'
    return
  }

  loading.value = true

  try {
    const api = useApi()
    
    const updateData: any = {}
    
    if (form.username !== originalValues.username) {
      updateData.Username = form.username
    }
    
    if (form.professionId !== originalValues.professionId) {
      const professionIdNum = parseInt(form.professionId.toString())
      
      if (!isNaN(professionIdNum) && professionIdNum > 0) {
        updateData.Profession = professionIdNum.toString()
      } else {
        console.error('Invalid profession ID:', form.professionId)
        errorMessage.value = 'Geçersiz meslek seçimi.'
        loading.value = false
        return
      }
    }
    
    // Check if updateData is empty
    if (Object.keys(updateData).length === 0) {
      console.error('No data to update - updateData is empty!')
      errorMessage.value = 'Güncellenecek veri bulunamadı.'
      loading.value = false
      return
    }
 
    const response = await api.profile.updateProfile(updateData)

    if (response.isSuccess) {
      successMessage.value = response.data || 'Profil başarıyla güncellendi.'
      
      // Update original values
      originalValues.username = form.username
      originalValues.professionId = form.professionId
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    } else {
      errorMessage.value = response.error || 'Profil güncellenirken hata oluştu.'
    }
  } catch (error: any) {
    errorMessage.value = error?.message || 'Beklenmeyen bir hata oluştu.'
  } finally {
    loading.value = false
  }
}

// Initialize
onMounted(async () => {
  if (!isAuthenticated.value) {
    await navigateTo('/auth/login')
    return
  }
  
  await loadProfile()
})
</script>

<style scoped>
.avatar-lg {
  width: 80px;
  height: 80px;
}

.card {
  transition: all 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.form-control:focus,
.form-select:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
}
</style> 