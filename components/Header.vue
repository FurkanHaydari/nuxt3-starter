<template>
  <header class="header-main text-white sticky-top">
    <!-- Ana Header -->
    <nav class="navbar navbar-expand-lg navbar-dark header-nav py-2">
      <div class="container-fluid">
        <!-- Logo/Marka -->
        <NuxtLink to="/" class="navbar-brand d-flex align-items-center brand-logo">
          <i class="bi bi-dice-5-fill fs-3 brand-icon me-2" aria-hidden="true"></i>
          <span class="fw-bold brand-text">BetStarter</span>
        </NuxtLink>

        <!-- Mobil Toggle Butonu -->
        <button 
          class="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="mainNavbar">
          <!-- Sol Navigasyon -->
          <ul class="navbar-nav me-auto">
            <li class="nav-item dropdown">
              <a 
                class="nav-link dropdown-toggle fw-semibold" 
                href="#" 
                id="helpDropdown" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
                aria-haspopup="true"
              >
                <i class="bi bi-question-circle me-2"></i>Yardım
              </a>
              <ul class="dropdown-menu shadow-lg border-0" aria-labelledby="helpDropdown">
                <li>
                  <NuxtLink to="/contact" class="dropdown-item">
                    <i class="bi bi-envelope me-2"></i>Bize Yazın
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/contact-info" class="dropdown-item">
                    <i class="bi bi-telephone me-2"></i>İletişim Bilgileri
                  </NuxtLink>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <NuxtLink to="/about" class="dropdown-item">
                    <i class="bi bi-info-circle me-2"></i>Hakkımızda
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/cookie-policy" class="dropdown-item">
                    <i class="bi bi-shield-check me-2"></i>Çerez Politikası
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/privacy-policy" class="dropdown-item">
                    <i class="bi bi-lock me-2"></i>Kişisel Veri Koruma
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/help" class="dropdown-item">
                    <i class="bi bi-life-preserver me-2"></i>Yardım
                  </NuxtLink>
                </li>
              </ul>
            </li>
          </ul>

          <!-- Sağ Taraf - Auth Section (Desktop) -->
          <div class="d-none d-lg-flex align-items-center">
            <!-- Logged In User -->
            <div v-if="authenticated" class="d-flex align-items-center gap-3">
              <span class="text-light">
                <i class="bi bi-person-circle me-1"></i>
                Hoş geldiniz
                <template v-if="user?.firstName || user?.lastName">
                  <strong>{{ user?.firstName }} {{ user?.lastName }}</strong>
                </template>
                <template v-else-if="user?.username">
                  <strong>{{ user?.username }}</strong>
                </template>
                !
                <!-- Debug -->
                <small v-if="$dev" class="d-block">
                  Debug: {{ JSON.stringify({ firstName: user?.firstName, lastName: user?.lastName, username: user?.username }) }}
                </small>
              </span>
              <button @click="handleLogout" class="btn btn-outline-light btn-sm">
                <i class="bi bi-box-arrow-right me-1"></i>Çıkış
              </button>
            </div>
            
            <!-- Login Form -->
            <form v-else @submit.prevent="handleLogin" class="d-flex align-items-center gap-2">
              <div class="input-group input-group-sm" style="width: 200px;">
                <input
                  v-model="loginForm.username"
                  type="text"
                  class="form-control border-secondary bg-light"
                  :class="{ 'is-invalid': headerTcknError }"
                  placeholder="TC Kimlik No"
                  aria-label="TC Kimlik No"
                  maxlength="11"
                  @input="validateHeaderTckn"
                  @blur="validateHeaderTckn"
                  required
                >
              </div>
              
              <div class="input-group input-group-sm" style="width: 150px;">
                <input
                  v-model="loginForm.password"
                  :type="headerShowPassword ? 'text' : 'password'"
                  class="form-control border-secondary bg-light"
                  :class="{ 'is-invalid': headerPasswordError }"
                  placeholder="Şifre"
                  aria-label="Şifre"
                  @input="validateHeaderPassword"
                  @blur="validateHeaderPassword"
                  required
                >
                <button 
                  type="button" 
                  class="btn btn-outline-secondary btn-sm"
                  @click="toggleHeaderPasswordVisibility"
                  :disabled="loading">
                  <i :class="headerShowPassword ? 'bi bi-eye-slash' : 'bi bi-eye'" style="font-size: 0.75rem;"></i>
                </button>
              </div>

              <button 
                type="submit" 
                class="btn btn-accent btn-sm fw-semibold px-3"
                :disabled="loading || !isHeaderFormValid">
                <span v-if="loading" class="spinner-border spinner-border-sm me-1" role="status"></span>
                <i v-else class="bi bi-box-arrow-in-right me-1"></i>
                {{ loading ? 'Giriş...' : 'Giriş' }}
              </button>
            </form>

            <!-- Error message for header login -->
            <div v-if="headerError && !authenticated" class="position-absolute top-100 start-0 mt-2 w-100">
              <div class="alert alert-danger alert-sm py-1 px-2 small" role="alert">
                <i class="bi bi-exclamation-triangle me-1"></i>
                {{ headerError }}
              </div>
            </div>

            <div v-if="!authenticated" class="vr mx-3 opacity-50"></div>
            
            <div v-if="!authenticated" class="d-flex align-items-center gap-2">
              <NuxtLink to="/auth/forgot-password" class="text-accent text-decoration-none small">
                <i class="bi bi-key me-1"></i>Unuttum
              </NuxtLink>
              
              <div class="vr mx-2 opacity-50"></div>
              
              <!-- Dikkat Çekici Register Butonu -->
              <NuxtLink to="/auth/register" class="btn btn-gradient-primary btn-sm fw-bold px-3 position-relative register-btn-animated">
                <i class="bi bi-person-plus me-1"></i>
                <span>Üye Ol</span>
                <span class="badge bg-warning text-dark ms-2 pulse-animation">BONUS</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Mobil Login Butonlar -->
          <div class="d-lg-none mt-3">
            <div v-if="authenticated" class="text-center">
              <span class="text-light d-block mb-2">
                <i class="bi bi-person-circle me-1"></i>
                Hoş geldiniz
                <template v-if="user?.firstName || user?.lastName">
                  <strong>{{ user?.firstName }} {{ user?.lastName }}</strong>
                </template>
                <template v-else-if="user?.username">
                  <strong>{{ user?.username }}</strong>
                </template>
                !
              </span>
              <button @click="handleLogout" class="btn btn-outline-light btn-sm">
                <i class="bi bi-box-arrow-right me-1"></i>Çıkış
              </button>
            </div>
            <div v-else class="d-flex gap-2">
              <NuxtLink to="/auth/login" class="btn btn-accent btn-sm" style="flex: 1;">
                <i class="bi bi-box-arrow-in-right me-1"></i>Giriş Yap
              </NuxtLink>
              <NuxtLink to="/auth/register" class="btn btn-gradient-primary btn-sm fw-bold position-relative" style="flex: 1.5;">
                <i class="bi bi-person-plus me-1"></i>Üye Ol
                <span class="badge bg-warning text-dark ms-1 small">BONUS</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'

// Auth composable
const { 
  login, 
  logout, 
  authenticated, 
  loading, 
  user, 
  validateTckn, 
  validatePassword,
  getRememberedCredentials 
} = useAuth()

// Login form data
const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false
})

// Header form state
const headerError = ref('')
const headerShowPassword = ref(false)
const headerTcknError = ref('')
const headerPasswordError = ref('')

// Header form validation
const isHeaderFormValid = computed(() => {
  return loginForm.username && 
         loginForm.password && 
         !headerTcknError.value && 
         !headerPasswordError.value
})

// Load remembered credentials on mount
onMounted(() => {
  const remembered = getRememberedCredentials()
  if (remembered.rememberMe) {
    loginForm.username = remembered.tckn
    loginForm.password = remembered.password
    loginForm.rememberMe = remembered.rememberMe
  }
})

// Toggle password visibility for header
const toggleHeaderPasswordVisibility = () => {
  headerShowPassword.value = !headerShowPassword.value
}

// Header field validations
const validateHeaderTckn = () => {
  const validation = validateTckn(loginForm.username)
  headerTcknError.value = validation.isValid ? '' : validation.error || ''
  headerError.value = '' // Clear general error when user starts typing
}

const validateHeaderPassword = () => {
  const validation = validatePassword(loginForm.password)
  headerPasswordError.value = validation.isValid ? '' : validation.error || ''
  headerError.value = '' // Clear general error when user starts typing
}

// Login handler
const handleLogin = async () => {
  headerError.value = ''
  
  // Final validation before submit
  validateHeaderTckn()
  validateHeaderPassword()

  if (!isHeaderFormValid.value) {
    return
  }

  const result = await login({
    tckn: loginForm.username,
    password: loginForm.password,
    rememberMe: loginForm.rememberMe
  })

  if (result.success) {
    // Reset form
    loginForm.username = ''
    loginForm.password = ''
    loginForm.rememberMe = false
    headerError.value = ''
    headerTcknError.value = ''
    headerPasswordError.value = ''
    
    // Redirect to dashboard or home
    await navigateTo('/')
  } else {
    headerError.value = result.error || 'Giriş yapılırken bir hata oluştu'
  }
}

// Logout handler
const handleLogout = async () => {
  await logout()
}
</script>

<style scoped>
/* Header Ana Stil */
.header-main {
  background: var(--navbar-bg);
  box-shadow: 0 2px 10px var(--shadow-dark);
}

.header-nav {
  background: transparent;
}

/* Brand Logo */
.brand-logo {
  transition: var(--transition-base);
  text-decoration: none;
}

.brand-logo:hover {
  transform: translateY(-2px);
  text-decoration: none;
}

.brand-icon {
  color: var(--navbar-brand);
  transition: var(--transition-base);
}

.brand-text {
  color: var(--navbar-text);
}

.brand-logo:hover .brand-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 4px 8px var(--shadow-accent));
}

/* Dropdown Menu */
.dropdown-menu {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  margin-top: 8px;
  box-shadow: 0 8px 25px var(--shadow-light);
}

.dropdown-item {
  padding: 0.75rem 1.25rem;
  transition: var(--transition-base);
  color: var(--text-dark);
}

.dropdown-item:hover {
  background: var(--bg-gradient-accent);
  color: var(--text-dark);
  transform: translateX(8px);
  border-radius: 8px;
  margin: 0 0.5rem;
}

/* Form Styling */
.form-control {
  background: var(--bg-light);
  border: 1px solid var(--border-light);
  transition: var(--transition-base);
}

.form-control:focus {
  border-color: var(--border-primary);
  box-shadow: 0 0 0 0.2rem var(--shadow-accent);
  background: var(--bg-light);
}

.form-check-input:checked {
  background-color: var(--bs-accent);
  border-color: var(--bs-accent);
}

/* Custom Button Styles */
.btn-accent {
  background: var(--bg-gradient-accent);
  border: 1px solid var(--bs-accent);
  color: var(--text-dark) !important;
  font-weight: 600;
  transition: var(--transition-base, all 0.3s ease);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--shadow-accent);
    filter: brightness(1.1);
  }
}

.btn-outline-accent {
  border: 2px solid var(--bs-accent);
  color: var(--bs-accent);
  background: transparent;
  font-weight: 600;
  transition: var(--transition-base);
}

.btn-outline-accent:hover {
  background: var(--bg-gradient-accent);
  color: var(--text-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-accent);
}

/* Text Colors */
.text-accent {
  color: var(--text-accent) !important;
  transition: var(--transition-base);
}

.text-accent:hover {
  color: var(--bs-accent) !important;
  text-decoration: none !important;
}

/* Responsive */
@media (max-width: 991.98px) {
  .navbar-collapse {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background: var(--bg-gradient-secondary);
    border-radius: 12px;
    margin-top: 1rem;
    padding: 1.5rem;
  }
  
  .brand-logo {
    font-size: 1.1rem;
  }
  
  .brand-icon {
    font-size: 1.5rem !important;
  }
}

/* Input Group Styling */
.input-group-sm .form-control {
  font-size: 0.875rem;
  border-radius: 8px;
}

.input-group-sm .form-control:first-child {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.input-group-sm .form-control:last-child {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

/* Form Check Styling */
.form-check-label {
  color: var(--text-white);
  font-size: 0.8rem;
}

/* Vertical Divider */
.vr {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Header form validation styles */
.input-group-sm .form-control.is-invalid {
  border-color: #dc3545;
}

.input-group-sm .btn {
  border-left: 0;
}

.input-group-sm .form-control:focus + .btn {
  border-color: #86b7fe;
}

.is-invalid ~ .btn {
  border-color: #dc3545;
}

/* Header error alert */
.alert-sm {
  font-size: 0.75rem;
  border-radius: 0.375rem;
}

/* Position relative for error positioning */
.d-none.d-lg-flex {
  position: relative;
}

/* Gradient Register Button */
.btn-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white !important;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-gradient-primary:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
  color: white !important;
}

.btn-gradient-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.4);
}

/* Register Button Animation */
.register-btn-animated {
  animation: subtle-glow 3s ease-in-out infinite;
}

.register-btn-animated:hover {
  animation: none;
}

@keyframes subtle-glow {
  0%, 100% {
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }
  50% {
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.6);
  }
}

/* Pulse Animation for BONUS Badge */
.pulse-animation {
  animation: pulse-badge 2s ease-in-out infinite;
}

@keyframes pulse-badge {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
}

/* Badge Styling */
.badge.bg-warning {
  background: linear-gradient(45deg, #ffc107, #ff8f00) !important;
  color: #000 !important;
  font-weight: 700;
  font-size: 0.65rem;
  border-radius: 12px;
  padding: 0.25rem 0.5rem;
  text-shadow: none;
  box-shadow: 0 2px 4px rgba(255, 193, 7, 0.3);
}

/* Mobile responsive adjustments */
@media (max-width: 991.98px) {
  .btn-gradient-primary {
    font-size: 0.875rem;
  }
  
  .badge.bg-warning {
    font-size: 0.6rem;
    padding: 0.2rem 0.4rem;
  }
}
</style> 