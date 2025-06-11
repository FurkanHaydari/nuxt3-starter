<script setup lang="ts">
import { ref, inject, computed, watch, onMounted, onUnmounted, nextTick, type Ref } from 'vue'

// Meta tags
useHead({
  title: 'BetStarter - Bahis ve Spor Platformu',
  meta: [
    {
      name: 'description',
      content: 'Modern bahis ve spor platformu ile heyecanı yaşayın!'
    }
  ]
})

// Sports data
const { 
  sportsData, 
  initializeSportsData, 
  getSportMatches, 
  getLiveMatches,
  startDynamicUpdates,
  stopDynamicUpdates
} = useSportsData()

// Inject selected sport from layout  
const selectedSport = inject('selectedSport', ref('futbol')) as Ref<string>

// Reactive data
const currentMatches = ref<any[]>([])
const selectedSportInfo = ref<{name: string, icon: string}>({
  name: 'Futbol',
  icon: 'bi bi-dribbble'
})

// Odds tracking için state
const previousOdds = ref<Map<string, any>>(new Map())
const oddsAnimations = ref<Map<string, { home?: string, draw?: string, away?: string }>>(new Map())

// Computed
const liveMatches = computed(() => {
  if (sportsData.value.length === 0) return []
  
  // Eğer spor seçiliyse, o spor kategorisindeki canlı maçları getir
  if (selectedSport.value && selectedSport.value !== 'futbol') {
    const sportMatches = getSportMatches(selectedSport.value)
    return sportMatches.filter(match => match.isLive).slice(0, 3)
  }
  
  // Varsayılan olarak tüm sporlardan canlı maçları getir
  return getLiveMatches().slice(0, 3)
})

const popularEvents = computed(() => {
  if (sportsData.value.length === 0) return []
  return sportsData.value
    .filter(sport => sport.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map(sport => ({
      id: sport.id,
      title: sport.name,
      subtitle: `${sport.count} maç`,
      count: sport.count,
      icon: sport.icon
    }))
})

// Methods
const handleSportChange = (sportId: string) => {
  selectedSport.value = sportId
  currentMatches.value = getSportMatches(sportId)
  
  const sportInfo = sportsData.value.find(s => s.id === sportId)
  if (sportInfo) {
    selectedSportInfo.value = {
      name: sportInfo.name,
      icon: sportInfo.icon
    }
  }
}

// Watch for sport changes
watch(selectedSport, (newSportId) => {
  if (newSportId && sportsData.value.length > 0) {
    handleSportChange(newSportId)
  }
}, { immediate: false })

// Watch for odds changes in live matches
watch(liveMatches, (newMatches, oldMatches) => {
  if (!oldMatches || oldMatches.length === 0) {
    // İlk yükleme - önceki oranları kaydet
    newMatches.forEach(match => {
      if (match.odds) {
        previousOdds.value.set(match.id, { ...match.odds })
      }
    })
    return
  }

  newMatches.forEach(match => {
    if (!match.odds) return
    
    const prevOdds = previousOdds.value.get(match.id)
    if (!prevOdds) {
      previousOdds.value.set(match.id, { ...match.odds })
      return
    }

    const animations: { home?: string, draw?: string, away?: string } = {}

    // Home odds değişimi
    if (match.odds.home !== prevOdds.home) {
      animations.home = match.odds.home > prevOdds.home ? 'odds-up' : 'odds-down'
    }

    // Draw odds değişimi (futbol için)
    if (match.odds.draw && prevOdds.draw && match.odds.draw !== prevOdds.draw) {
      animations.draw = match.odds.draw > prevOdds.draw ? 'odds-up' : 'odds-down'
    }

    // Away odds değişimi
    if (match.odds.away !== prevOdds.away) {
      animations.away = match.odds.away > prevOdds.away ? 'odds-up' : 'odds-down'
    }

    // Animasyonları kaydet
    if (Object.keys(animations).length > 0) {
      oddsAnimations.value.set(match.id, animations)
      
      // Animasyonu temizle
      setTimeout(() => {
        oddsAnimations.value.delete(match.id)
      }, 1500)
    }

    // Yeni oranları kaydet
    previousOdds.value.set(match.id, { ...match.odds })
  })
}, { deep: true })

// Initialize
onMounted(() => {
  initializeSportsData()
  
  // Set initial sport matches after data is loaded
  nextTick(() => {
    setTimeout(() => {
      handleSportChange('futbol')
    }, 100)
  })
  
  // Start dynamic updates
  startDynamicUpdates()
})

// Cleanup
onUnmounted(() => {
  stopDynamicUpdates()
})
</script>

<template>
  <div class="homepage">
    <!-- Hero Bölümü -->
    <section class="hero-section bg-gradient-primary text-white py-5">
      <div class="container">
        <div class="row align-items-center min-vh-50">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold mb-4">
              Spor Bahislerinde 
              <span class="text-warning">Yeni Çağ</span>
            </h1>
            <p class="lead mb-4">
              En popüler spor karşılaşmalarına bahis yapın, canlı maçları takip edin ve kazancınızı artırın. 
              Güvenli ve hızlı ödeme seçenekleri ile hemen başlayın!
            </p>
            <div class="d-flex gap-3 flex-wrap">
              <NuxtLink to="/auth/register" class="btn btn-accent btn-lg px-4 fw-semibold">
                <i class="bi bi-person-plus me-2"></i>
                Hemen Üye Ol
              </NuxtLink>
              <NuxtLink to="/auth/login" class="btn btn-outline-light btn-lg px-4">
                <i class="bi bi-box-arrow-in-right me-2"></i>
                Giriş Yap
              </NuxtLink>
            </div>
          </div>
                      <div class="col-lg-6 text-center">
              <div class="hero-illustration">
                <i class="bi bi-trophy hero-trophy" style="font-size: 8rem; opacity: 0.8;"></i>
              </div>
            </div>
        </div>
      </div>
    </section>

    <!-- Canlı Maçlar -->
    <section class="live-matches py-5 bg-light">
      <div class="container">
        <div class="row mb-4">
          <div class="col-12 text-center">
            <h2 class="fw-bold mb-3">
              <i class="bi bi-broadcast text-danger me-2"></i>
              {{ selectedSport.value !== 'futbol' ? selectedSportInfo.name + ' - ' : '' }}Canlı Maçlar
            </h2>
            <p class="text-muted">{{ selectedSport.value !== 'futbol' ? selectedSportInfo.name + ' kategorisinde' : '' }} şu anda devam eden heyecanlı karşılaşmalar</p>
          </div>
        </div>
        
        <div class="row g-4">
          <div 
            v-for="match in liveMatches" 
            :key="match.id"
            class="col-md-6 col-lg-4"
          >
            <div class="card match-card h-100 shadow-sm border-0">
              <div class="card-header bg-danger text-white d-flex justify-content-between align-items-center">
                <span class="badge bg-light text-dark">{{ match.league }}</span>
                <span class="live-indicator">
                  <i class="bi bi-record-circle-fill me-1 animate-pulse"></i>
                  CANLI
                </span>
              </div>
              <div class="card-body text-center">
                <div class="teams-container">
                  <div class="team">
                    <h6 class="team-name">{{ match.homeTeam.name }}</h6>
                    <span class="score">{{ match.homeScore }}</span>
                  </div>
                  <div class="vs-divider">
                    <span class="vs">VS</span>
                    <div class="minute text-accent fw-bold">{{ match.minute || match.period }}</div>
                  </div>
                  <div class="team">
                    <h6 class="team-name">{{ match.awayTeam.name }}</h6>
                    <span class="score">{{ match.awayScore }}</span>
                  </div>
                </div>
                
                <!-- Betting Odds -->
                <div class="betting-odds mt-3" v-if="match.odds">
                  <div class="d-flex justify-content-center gap-2">
                    <button 
                      class="btn btn-sm btn-outline-primary"
                      :class="oddsAnimations.get(match.id)?.home"
                    >
                      1: {{ match.odds.home }}
                    </button>
                    <button 
                      class="btn btn-sm btn-outline-primary" 
                      v-if="match.odds.draw"
                      :class="oddsAnimations.get(match.id)?.draw"
                    >
                      X: {{ match.odds.draw }}
                    </button>
                    <button 
                      class="btn btn-sm btn-outline-primary"
                      :class="oddsAnimations.get(match.id)?.away"
                    >
                      2: {{ match.odds.away }}
                    </button>
                  </div>
                </div>
              </div>
              <div class="card-footer bg-transparent">
                <button class="btn btn-primary btn-sm w-100">
                  <i class="bi bi-eye me-2"></i>
                  Detay & Bahis
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Popüler Etkinlikler -->
    <section class="popular-events py-5">
      <div class="container">
        <div class="row mb-4">
          <div class="col-12 text-center">
            <h2 class="fw-bold mb-3">
              <i class="bi bi-fire text-warning me-2"></i>
              Popüler Etkinlikler
            </h2>
            <p class="text-muted">En çok bahis yapılan spor karşılaşmaları</p>
          </div>
        </div>
        
        <div class="row g-4">
          <div 
            v-for="event in popularEvents" 
            :key="event.id"
            class="col-md-6 col-lg-4"
          >
            <div class="card event-card h-100 shadow-sm border-0 hover-lift">
              <div class="card-body text-center p-4">
                <div class="event-icon mb-3">
                  <i :class="event.icon" class="text-primary" style="font-size: 3rem;"></i>
                </div>
                <h5 class="card-title fw-bold">{{ event.title }}</h5>
                <p class="card-text text-muted">{{ event.subtitle }}</p>
                <div class="event-count">
                  <span class="badge badge-accent text-dark fs-6">
                    {{ event.count }} Maç
                  </span>
                </div>
              </div>
              <div class="card-footer bg-transparent border-0 text-center">
                <button class="btn btn-outline-primary">
                  <i class="bi bi-arrow-right me-2"></i>
                  İncele
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Seçilen Spordan Maçlar -->
    <MatchList 
      v-if="currentMatches.length > 0"
      :matches="currentMatches"
      :selected-sport-name="selectedSportInfo.name"
      :selected-sport-icon="selectedSportInfo.icon"
    />

    <!-- Özellikler -->
    <section class="features py-5 bg-light">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h2 class="fw-bold mb-3">Neden BetStarter?</h2>
            <p class="text-muted">Size en iyi bahis deneyimini sunmak için buradayız</p>
          </div>
        </div>
        
        <div class="row g-4">
          <div class="col-md-6 col-lg-3">
            <div class="feature-item text-center">
              <div class="feature-icon mb-3">
                <i class="bi bi-shield-check text-success" style="font-size: 3rem;"></i>
              </div>
              <h5 class="fw-bold">Güvenli</h5>
              <p class="text-muted">256-bit SSL şifrelemesi ile korumalı</p>
            </div>
          </div>
          
          <div class="col-md-6 col-lg-3">
            <div class="feature-item text-center">
              <div class="feature-icon mb-3">
                <i class="bi bi-lightning text-warning" style="font-size: 3rem;"></i>
              </div>
              <h5 class="fw-bold">Hızlı</h5>
              <p class="text-muted">Anında para yatırma ve çekme</p>
            </div>
          </div>
          
          <div class="col-md-6 col-lg-3">
            <div class="feature-item text-center">
              <div class="feature-icon mb-3">
                <i class="bi bi-headset text-info" style="font-size: 3rem;"></i>
              </div>
              <h5 class="fw-bold">7/24 Destek</h5>
              <p class="text-muted">Her zaman yanınızdayız</p>
            </div>
          </div>
          
          <div class="col-md-6 col-lg-3">
            <div class="feature-item text-center">
              <div class="feature-icon mb-3">
                <i class="bi bi-gift text-danger" style="font-size: 3rem;"></i>
              </div>
              <h5 class="fw-bold">Bonuslar</h5>
              <p class="text-muted">Sürekli kampanya ve promosyonlar</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Hero Section */
.bg-gradient-primary {
  background: var(--bg-gradient-primary);
}

.min-vh-50 {
  min-height: 50vh;
}

.hero-illustration {
  animation: float 3s ease-in-out infinite;
}

.hero-trophy {
  color: var(--bs-accent);
  filter: drop-shadow(0 8px 20px var(--shadow-accent));
}

/* Custom Buttons */
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

/* Custom Badge */
.badge-accent {
  background: var(--bg-gradient-accent) !important;
  color: var(--text-dark) !important;
}

/* Text Colors */
.text-accent {
  color: var(--text-accent) !important;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

/* Odds Animation */
@keyframes odds-up {
  0% { background-color: transparent; }
  15% { background-color: rgba(34, 197, 94, 0.3); } /* green-500 with opacity */
  100% { background-color: transparent; }
}

@keyframes odds-down {
  0% { background-color: transparent; }
  15% { background-color: rgba(239, 68, 68, 0.3); } /* red-500 with opacity */
  100% { background-color: transparent; }
}

.odds-up {
  animation: odds-up 1.5s ease-out;
}

.odds-down {
  animation: odds-down 1.5s ease-out;
}

.betting-odds .btn {
  transition: all 0.3s ease;
}

/* Match Cards */
.match-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

.match-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.live-indicator {
  animation: pulse 2s infinite;
  font-size: 0.8rem;
  font-weight: bold;
}

.teams-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.team {
  flex: 1;
}

.team-name {
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.score {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--bs-primary);
}

.vs-divider {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.vs {
  font-size: 0.8rem;
  color: var(--bs-secondary);
  font-weight: bold;
}

.minute {
  font-size: 0.75rem;
}

/* Event Cards */
.event-card {
  transition: all 0.3s ease;
  border-radius: 12px;
}

.hover-lift:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15) !important;
}

.event-icon {
  transition: transform 0.3s ease;
}

.event-card:hover .event-icon {
  transform: scale(1.1);
}

/* Features */
.feature-item {
  padding: 2rem 1rem;
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
}

.feature-icon {
  transition: transform 0.3s ease;
}

.feature-item:hover .feature-icon {
  transform: scale(1.1);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    text-align: center;
  }
  
  .teams-container {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .vs-divider {
    order: 2;
    margin: 1rem 0;
  }
  
  .score {
    font-size: 1.25rem;
  }
}

/* Animations */
@media (prefers-reduced-motion: reduce) {
  .hero-illustration,
  .live-indicator,
  .match-card,
  .event-card,
  .feature-item {
    animation: none;
    transition: none;
  }
}
</style>