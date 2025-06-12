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
                  placeholder="TC Kimlik No"
                  aria-label="TC Kimlik No"
                  maxlength="11"
                  required
                >
              </div>
              
              <div class="input-group input-group-sm" style="width: 150px;">
                <input
                  v-model="loginForm.password"
                  type="password"
                  class="form-control border-secondary bg-light"
                  placeholder="Şifre"
                  aria-label="Şifre"
                  required
                >
              </div>

              <button 
                type="submit" 
                class="btn btn-accent btn-sm fw-semibold px-3"
                :disabled="loading || !loginForm.username || !loginForm.password">
                <span v-if="loading" class="spinner-border spinner-border-sm me-1" role="status"></span>
                <i v-else class="bi bi-box-arrow-in-right me-1"></i>
                {{ loading ? 'Giriş...' : 'Giriş' }}
              </button>
            </form>

            <div v-if="!authenticated" class="vr mx-3 opacity-50"></div>
            
            <NuxtLink v-if="!authenticated" to="/auth/forgot-password" class="text-accent text-decoration-none small">
              <i class="bi bi-key me-1"></i>Unuttum
            </NuxtLink>
          </div>

          <!-- Mobil Login Butonlar -->
          <div class="d-lg-none mt-3">
            <div class="d-flex gap-2">
              <NuxtLink to="/auth/login" class="btn btn-accent btn-sm flex-fill">
                <i class="bi bi-box-arrow-in-right me-1"></i>Giriş Yap
              </NuxtLink>
              <NuxtLink to="/auth/register" class="btn btn-outline-accent btn-sm flex-fill">
                <i class="bi bi-person-plus me-1"></i>Üye Ol
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

// Auth composable
const { login, logout, authenticated, loading, user } = useAuth()

// Login form data
const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false
})

// Login handler
const handleLogin = async () => {
  const result = await login({
    tckn: loginForm.username,
    password: loginForm.password
  })

  if (result.success) {
    // Reset form
    loginForm.username = ''
    loginForm.password = ''
    loginForm.rememberMe = false
    
    // Redirect to dashboard or home
    await navigateTo('/')
  } else {
    console.error('Login error:', result.error)
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
</style> 