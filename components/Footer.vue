<template>
  <footer class="footer bg-dark text-light py-5">
    <div class="container">
      <!-- Main Footer Content -->
      <div class="row g-4">
        <!-- Logo & Description -->
        <div class="col-lg-3 col-md-6">
          <div class="footer-brand mb-3">
            <h5 class="fw-bold d-flex align-items-center text-white">
              <i class="bi bi-dice-5 me-2 text-warning"></i>
              BetStarter
            </h5>
            <p class="text-light mb-3 opacity-75">
              Güvenli, hızlı ve eğlenceli bahis deneyimi sunan modern platform.
            </p>
            <!-- Social Media -->
            <div class="social-links">
              <a href="#" class="btn btn-outline-light btn-sm me-2" aria-label="Facebook">
                <i class="bi bi-facebook"></i>
              </a>
              <a href="#" class="btn btn-outline-light btn-sm me-2" aria-label="Twitter">
                <i class="bi bi-twitter"></i>
              </a>
              <a href="#" class="btn btn-outline-light btn-sm me-2" aria-label="Instagram">
                <i class="bi bi-instagram"></i>
              </a>
              <a href="#" class="btn btn-outline-light btn-sm" aria-label="Telegram">
                <i class="bi bi-telegram"></i>
              </a>
            </div>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="col-lg-2 col-md-6">
          <h6 class="fw-semibold mb-3 text-white">Hızlı Erişim</h6>
          <ul class="list-unstyled footer-links">
            <li><NuxtLink to="/" class="text-light opacity-75">Ana Sayfa</NuxtLink></li>
            <li><NuxtLink to="/about" class="text-light opacity-75">Hakkımızda</NuxtLink></li>
            <li><NuxtLink to="/contact" class="text-light opacity-75">İletişim</NuxtLink></li>
            <li><NuxtLink to="/help" class="text-light opacity-75">Yardım</NuxtLink></li>
          </ul>
        </div>

        <!-- Sports -->
        <div class="col-lg-2 col-md-6">
          <h6 class="fw-semibold mb-3 text-white">Sporlar</h6>
          <ul class="list-unstyled footer-links">
            <li><a href="#" class="text-light opacity-75">Futbol</a></li>
            <li><a href="#" class="text-light opacity-75">Basketbol</a></li>
            <li><a href="#" class="text-light opacity-75">Tenis</a></li>
            <li><a href="#" class="text-light opacity-75">Voleybol</a></li>
            <li><a href="#" class="text-light opacity-75">E-Spor</a></li>
          </ul>
        </div>

        <!-- Account -->
        <div class="col-lg-2 col-md-6">
          <h6 class="fw-semibold mb-3 text-white">Hesap</h6>
          <ul class="list-unstyled footer-links">
            <li><NuxtLink to="/auth/login" class="text-light opacity-75">Giriş Yap</NuxtLink></li>
            <li><NuxtLink to="/auth/register" class="text-light opacity-75">Üye Ol</NuxtLink></li>
            <li><a href="#" class="text-light opacity-75">Para Yatır</a></li>
            <li><a href="#" class="text-light opacity-75">Para Çek</a></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="col-lg-3 col-md-6">
          <h6 class="fw-semibold mb-3 text-white">İletişim Bilgileri</h6>
          <ul class="list-unstyled footer-contact">
            <li class="mb-2">
              <i class="bi bi-geo-alt me-2 text-warning"></i>
              <span class="text-light">İstanbul, Türkiye</span>
            </li>
            <li class="mb-2">
              <i class="bi bi-telephone me-2 text-warning"></i>
              <span class="text-light">+90 (212) 555 0123</span>
            </li>
            <li class="mb-2">
              <i class="bi bi-envelope me-2 text-warning"></i>
              <span class="text-light">info@betstarter.com</span>
            </li>
            <li class="mb-2">
              <i class="bi bi-headset me-2 text-warning"></i>
              <span class="text-light">7/24 Canlı Destek</span>
            </li>
          </ul>
        </div>
      </div>

      <hr class="my-4 border-light border-opacity-25">

      <!-- Bottom Footer -->
      <div class="row align-items-center">
        <div class="col-md-6">
          <p class="text-light mb-0 opacity-75">
            &copy; {{ currentYear }} BetStarter. Tüm hakları saklıdır.
          </p>
        </div>
        <div class="col-md-6">
          <div class="footer-bottom-links text-md-end">
            <NuxtLink to="/privacy-policy" class="text-light me-3 opacity-75">Gizlilik Politikası</NuxtLink>
            <NuxtLink to="/cookie-policy" class="text-light me-3 opacity-75">Çerez Politikası</NuxtLink>
            <a href="#" class="text-light opacity-75">Kullanım Şartları</a>
          </div>
        </div>
      </div>

      <!-- Responsible Gaming Notice -->
      <div class="row mt-3">
        <div class="col-12">
          <div class="responsible-gaming p-3 rounded bg-warning bg-opacity-15 border border-warning border-opacity-50">
            <div class="d-flex align-items-center">
              <i class="bi bi-shield-exclamation text-warning me-2 fs-5"></i>
              <div class="small text-white">
                <strong class="text-warning">Sorumlu Oyun:</strong> 
                18 yaş altındaki kişilerin bahis oynaması yasaktır. Aşırı bahis oynamak zararlıdır. 
                <a href="#" class="text-warning fw-semibold text-decoration-underline">Yardım alın.</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Current year for copyright
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #1a1d29 0%, #2d3436 100%);
  border-top: 3px solid var(--bs-primary);
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
}

.footer-links a:hover {
  color: var(--bs-warning) !important;
  opacity: 1 !important;
  text-decoration: none;
  transform: translateX(5px);
}

.footer-contact li {
  display: flex;
  align-items: center;
}

.social-links .btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.social-links .btn:hover {
  background: var(--bs-warning);
  border-color: var(--bs-warning);
  color: #000;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(255, 193, 7, 0.4);
}

.footer-bottom-links a {
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.footer-bottom-links a:hover {
  color: var(--bs-warning) !important;
  opacity: 1 !important;
}

.responsible-gaming {
  backdrop-filter: blur(10px);
  background: rgba(255, 193, 7, 0.1) !important;
}

/* Better text contrast */
.text-light {
  color: #f8f9fa !important;
}

.opacity-75 {
  opacity: 0.85 !important;
}

.opacity-75:hover {
  opacity: 1 !important;
}

/* Section headings */
h6.text-white {
  color: #ffffff !important;
  font-size: 1rem;
  letter-spacing: 0.5px;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-bottom-links {
    margin-top: 1rem;
  }
  
  .footer-bottom-links a {
    display: block;
    margin-bottom: 0.5rem;
  }
  
  .social-links {
    margin-top: 1rem;
  }
  
  .responsible-gaming .small {
    font-size: 0.8rem !important;
  }
}
</style> 