<template>
  <section class="match-list py-4">
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h3 class="fw-bold mb-2">
                <i :class="selectedSportIcon" class="me-2 text-primary"></i>
                {{ selectedSportName }} Maçları
              </h3>
              <p class="text-muted mb-0">
                {{ matches.length }} maç bulundu
                <span v-if="liveMatchCount > 0" class="text-danger ms-2">
                  <i class="bi bi-record-circle-fill me-1"></i>
                  {{ liveMatchCount }} canlı
                </span>
              </p>
            </div>
            
            <!-- Filter Buttons -->
            <div class="filter-buttons">
              <div class="btn-group" role="group">
                <button
                  class="btn btn-sm"
                  :class="activeFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'"
                  @click="setFilter('all')"
                >
                  Tümü ({{ matches.length }})
                </button>
                <button
                  class="btn btn-sm"
                  :class="activeFilter === 'live' ? 'btn-danger' : 'btn-outline-danger'"
                  @click="setFilter('live')"
                  v-if="liveMatchCount > 0"
                >
                  <i class="bi bi-record-circle-fill me-1"></i>
                  Canlı ({{ liveMatchCount }})
                </button>
                <button
                  class="btn btn-sm"
                  :class="activeFilter === 'upcoming' ? 'btn-warning' : 'btn-outline-warning'"
                  @click="setFilter('upcoming')"
                >
                  Yaklaşan ({{ upcomingMatchCount }})
                </button>
                <button
                  class="btn btn-sm"
                  :class="activeFilter === 'finished' ? 'btn-secondary' : 'btn-outline-secondary'"
                  @click="setFilter('finished')"
                >
                  Biten ({{ finishedMatchCount }})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Matches Grid -->
      <div class="row g-3">
        <div 
          v-for="match in filteredMatches" 
          :key="match.id"
          class="col-lg-6 col-xl-4"
        >
          <div class="card match-card h-100 shadow-sm border-0">
            <!-- Card Header -->
            <div 
              class="card-header d-flex justify-content-between align-items-center"
              :class="{
                'bg-danger text-white': match.isLive,
                'bg-primary text-white': match.status === 'upcoming',
                'bg-secondary text-white': match.status === 'finished'
              }"
            >
              <div class="league-info">
                <small class="fw-semibold">{{ match.league }}</small>
                <br>
                <small class="opacity-75">{{ match.leagueCountry }}</small>
              </div>
              
              <div class="match-status text-end">
                <div v-if="match.isLive" class="live-badge">
                  <i class="bi bi-record-circle-fill me-1 live-pulse"></i>
                  <small class="fw-bold">CANLI</small>
                </div>
                <div v-else-if="match.status === 'upcoming'" class="upcoming-badge">
                  <small class="fw-semibold">{{ formatMatchTime(match.startTime) }}</small>
                </div>
                <div v-else-if="match.status === 'finished'" class="finished-badge">
                  <small class="fw-semibold">BİTTİ</small>
                </div>
              </div>
            </div>

            <!-- Card Body -->
            <div class="card-body p-3">
              <!-- Teams & Score -->
              <div class="teams-container">
                <!-- Home Team -->
                <div class="team home-team">
                  <div class="team-info">
                    <h6 class="team-name mb-1">{{ match.homeTeam.name }}</h6>
                    <small class="text-muted">{{ match.homeTeam.country }}</small>
                    <span v-if="match.homeTeam.ranking" class="ranking-badge ms-2">
                      #{{ match.homeTeam.ranking }}
                    </span>
                  </div>
                  <div class="team-score">
                    <span v-if="match.homeScore !== null" class="score">
                      {{ match.homeScore }}
                    </span>
                    <span v-else class="score-placeholder">-</span>
                  </div>
                </div>

                <!-- VS / Time -->
                <div class="match-center">
                  <div class="vs-section">
                    <span class="vs-text">VS</span>
                    <div v-if="match.minute" class="match-time">
                      <small class="fw-bold text-accent">{{ match.minute }}</small>
                    </div>
                    <div v-else-if="match.status === 'upcoming'" class="match-time">
                      <small class="text-muted">{{ formatTime(match.startTime) }}</small>
                    </div>
                  </div>
                </div>

                <!-- Away Team -->
                <div class="team away-team">
                  <div class="team-score">
                    <span v-if="match.awayScore !== null" class="score">
                      {{ match.awayScore }}
                    </span>
                    <span v-else class="score-placeholder">-</span>
                  </div>
                  <div class="team-info text-end">
                    <h6 class="team-name mb-1">{{ match.awayTeam.name }}</h6>
                    <small class="text-muted">{{ match.awayTeam.country }}</small>
                    <span v-if="match.awayTeam.ranking" class="ranking-badge ms-2">
                      #{{ match.awayTeam.ranking }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Odds Section -->
              <div v-if="match.odds && match.status !== 'finished'" class="odds-section mt-3 pt-3 border-top">
                <div class="row g-2">
                  <div class="col">
                    <button 
                      class="btn btn-outline-primary btn-sm w-100 odds-btn"
                      :class="oddsAnimations.get(match.id)?.home"
                    >
                      <small class="d-block text-muted">1</small>
                      <span class="fw-bold">{{ match.odds.home }}</span>
                    </button>
                  </div>
                  <div v-if="match.odds.draw" class="col">
                    <button 
                      class="btn btn-outline-secondary btn-sm w-100 odds-btn"
                      :class="oddsAnimations.get(match.id)?.draw"
                    >
                      <small class="d-block text-muted">X</small>
                      <span class="fw-bold">{{ match.odds.draw }}</span>
                    </button>
                  </div>
                  <div class="col">
                    <button 
                      class="btn btn-outline-primary btn-sm w-100 odds-btn"
                      :class="oddsAnimations.get(match.id)?.away"
                    >
                      <small class="d-block text-muted">2</small>
                      <span class="fw-bold">{{ match.odds.away }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card Footer -->
            <div class="card-footer bg-transparent border-0 text-center">
              <button class="btn btn-primary btn-sm w-100">
                <i class="bi bi-eye me-2"></i>
                Detayları Gör
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredMatches.length === 0" class="row">
        <div class="col-12 text-center py-5">
          <i class="bi bi-search fs-1 text-muted mb-3"></i>
          <h5 class="text-muted">Maç Bulunamadı</h5>
          <p class="text-muted">Seçilen filtreye uygun maç bulunmamaktadır.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

// Props
interface Props {
  matches: any[]
  selectedSportName: string
  selectedSportIcon: string
}

const props = defineProps<Props>()

// Reactive data
const activeFilter = ref<string>('all')

// Odds tracking için state
const previousOdds = ref<Map<string, any>>(new Map())
const oddsAnimations = ref<Map<string, { home?: string, draw?: string, away?: string }>>(new Map())

// Computed properties
const liveMatchCount = computed(() => 
  props.matches.filter(match => match.isLive).length
)

const upcomingMatchCount = computed(() => 
  props.matches.filter(match => match.status === 'upcoming').length
)

const finishedMatchCount = computed(() => 
  props.matches.filter(match => match.status === 'finished').length
)

const filteredMatches = computed(() => {
  switch (activeFilter.value) {
    case 'live':
      return props.matches.filter(match => match.isLive)
    case 'upcoming':
      return props.matches.filter(match => match.status === 'upcoming')
    case 'finished':
      return props.matches.filter(match => match.status === 'finished')
    default:
      return props.matches
  }
})

// Methods
const setFilter = (filter: string) => {
  activeFilter.value = filter
}

const formatMatchTime = (date: Date) => {
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  
  if (diffHours < 0) {
    return 'Başladı'
  } else if (diffHours === 0) {
    return `${diffMinutes}dk sonra`
  } else if (diffHours < 24) {
    return `${diffHours}s ${diffMinutes}dk`
  } else {
    return date.toLocaleDateString('tr-TR', { 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('tr-TR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// Watch for odds changes in all matches
watch(() => props.matches, (newMatches, oldMatches) => {
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
</script>

<style scoped>
/* Match Card */
.match-card {
  transition: var(--transition-base);
  border-radius: 12px;
  overflow: hidden;
}

.match-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px var(--shadow-primary);
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

/* Card Header */
.card-header {
  border-bottom: none;
  padding: 0.75rem 1rem;
}

.live-badge {
  animation: pulse 2s infinite;
}

.live-pulse {
  animation: pulse 1.5s infinite;
}

/* Teams Container */
.teams-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.team {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.home-team {
  justify-content: flex-start;
}

.away-team {
  justify-content: flex-end;
  flex-direction: row-reverse;
}

.team-info {
  flex: 1;
}

.team-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
}

.team-score {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
}

.score {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-primary);
}

.score-placeholder {
  font-size: 1.5rem;
  color: var(--text-muted);
}

.ranking-badge {
  background: var(--bg-gradient-accent);
  color: var(--text-dark);
  padding: 0.125rem 0.375rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
}

/* Match Center */
.match-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 60px;
}

.vs-section {
  text-align: center;
}

.vs-text {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: bold;
}

.match-time {
  margin-top: 0.25rem;
}

/* Odds Section */
.odds-section {
  background: var(--bg-accent);
  margin: 0 -1rem;
  padding: 0.75rem 1rem 0.5rem;
}

.odds-btn {
  padding: 0.5rem 0.25rem;
  transition: var(--transition-base);
  border-radius: 8px;
}

.odds-btn:hover {
  transform: scale(1.05);
  background: var(--bg-gradient-primary);
  color: white !important;
  border-color: var(--bs-primary);
}

/* Filter Buttons */
.filter-buttons .btn {
  border-radius: 20px;
  padding: 0.375rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  transition: var(--transition-base);
}

.filter-buttons .btn:hover {
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .teams-container {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .home-team,
  .away-team {
    width: 100%;
    justify-content: space-between;
  }
  
  .away-team {
    flex-direction: row;
  }
  
  .match-center {
    order: -1;
    margin: 0.5rem 0;
  }
  
  .filter-buttons {
    margin-top: 1rem;
  }
  
  .filter-buttons .btn-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  
  .filter-buttons .btn {
    flex: 1;
    min-width: auto;
  }
}

/* Animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@media (prefers-reduced-motion: reduce) {
  .match-card,
  .odds-btn,
  .filter-buttons .btn,
  .live-badge,
  .live-pulse {
    animation: none;
    transition: none;
  }
}
</style> 