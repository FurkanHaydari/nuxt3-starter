<template>
  <section class="sport-menu-slider bg-light border-bottom">
    <div class="container-fluid py-2">
      <!-- Kaydırılabilir Spor Menüsü -->
      <div class="row">
        <div class="col-12">
          <div class="sport-menu-container position-relative">
            <!-- Sol Kaydırma Butonu -->
            <button
              class="btn btn-outline-secondary btn-sm scroll-btn scroll-btn-left"
              @click="scrollLeft"
              :disabled="!canScrollLeft"
              aria-label="Sola kaydır"
            >
              <i class="bi bi-chevron-left"></i>
            </button>

            <!-- Spor Menüsü -->
            <div 
              ref="sportMenuRef"
              class="sport-menu-scroll d-flex gap-2 overflow-auto"
              @scroll="handleScroll"
            >
              <button
                v-for="sport in sportsData"
                :key="sport.id"
                class="btn sport-item"
                :class="[
                  activeSportId === sport.id ? 'btn-primary active' : 'btn-outline-primary',
                  { 'live': sport.isLive }
                ]"
                @click="selectSport(sport.id)"
                :aria-pressed="activeSportId === sport.id"
              >
                <div class="d-flex align-items-center gap-2 text-nowrap">
                  <!-- Spor İkonu -->
                  <i :class="sport.icon" class="fs-6"></i>
                  
                  <!-- Spor Adı -->
                  <span class="fw-semibold">{{ sport.name }}</span>
                  
                  <!-- Badge (Canlı sayısı vb.) -->
                  <span 
                    v-if="sport.count > 0"
                    class="badge"
                    :class="sport.isLive ? 'bg-danger' : 'bg-secondary'"
                  >
                    {{ sport.count }}
                  </span>

                  <!-- Canlı İndikatörü -->
                  <span 
                    v-if="sport.isLive" 
                    class="live-indicator"
                    aria-hidden="true"
                  ></span>
                </div>
              </button>
            </div>

            <!-- Sağ Kaydırma Butonu -->
            <button
              class="btn btn-outline-secondary btn-sm scroll-btn scroll-btn-right"
              @click="scrollRight"
              :disabled="!canScrollRight"
              aria-label="Sağa kaydır"
            >
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'

// Interface tanımları
interface SportItem {
  id: string
  name: string
  icon: string
  count: number
  isLive: boolean
}

// Props
interface Props {
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 'futbol'
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'sport-change': [sportId: string]
}>()

// Reactive data
const sportMenuRef = ref<HTMLDivElement>()
const activeSportId = ref<string>(props.modelValue)
const canScrollLeft = ref<boolean>(false)
const canScrollRight = ref<boolean>(true)

// Import sports data
const { sportsData: allSportsData, initializeSportsData } = useSportsData()

// Transform sports data for component
const sportsData = computed(() => {
  return allSportsData.value.map(sport => ({
    id: sport.id,
    name: sport.name,
    icon: sport.icon,
    count: sport.count,
    isLive: sport.isLive
  }))
})

// Methods
const selectSport = (sportId: string) => {
  activeSportId.value = sportId
  emit('update:modelValue', sportId)
  emit('sport-change', sportId)
}

const scrollLeft = () => {
  if (sportMenuRef.value) {
    sportMenuRef.value.scrollBy({
      left: -300,
      behavior: 'smooth'
    })
    setTimeout(() => {
      handleScroll()
    }, 300)
  }
}

const scrollRight = () => {
  if (sportMenuRef.value) {
    sportMenuRef.value.scrollBy({
      left: 300,
      behavior: 'smooth'
    })
    setTimeout(() => {
      handleScroll()
    }, 300)
  }
}

const handleScroll = () => {
  if (sportMenuRef.value) {
    const { scrollLeft, scrollWidth, clientWidth } = sportMenuRef.value
    canScrollLeft.value = scrollLeft > 5
    canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 5
  }
}

// Lifecycle
onMounted(() => {
  // Initialize sports data
  initializeSportsData()
  
  // DOM fully loaded olana kadar bekle
  nextTick(() => {
    setTimeout(() => {
      handleScroll()
    }, 100)
  })
  
  // Resize event listener
  window.addEventListener('resize', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleScroll)
})

// Watch props changes
watch(() => props.modelValue, (newValue) => {
  if (newValue && newValue !== activeSportId.value) {
    activeSportId.value = newValue
  }
})
</script>

<style scoped>
.sport-menu-slider {
  background: var(--sport-slider-bg);
  border-bottom: 1px solid var(--border-light);
}

.sport-menu-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sport-menu-scroll {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scroll-behavior: smooth;
  padding: 0.25rem 0;
  flex: 1;
  min-width: 0;
}

.sport-menu-scroll::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.scroll-btn {
  position: sticky;
  z-index: 10;
  min-width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 2px solid #dee2e6;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.scroll-btn:hover:not(:disabled) {
  background: var(--bg-gradient-primary);
  color: white;
  border-color: var(--bs-primary);
  transform: scale(1.05);
}

.scroll-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.scroll-btn-left {
  left: 0;
}

.scroll-btn-right {
  right: 0;
}

.sport-item {
  border-radius: 25px;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  position: relative;
  min-width: fit-content;
  white-space: nowrap;
  border-width: 2px;
}

.sport-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--sport-item-hover);
}

.sport-item.active {
  background: var(--bg-gradient-primary) !important;
  border-color: var(--bs-primary) !important;
  color: white !important;
  font-weight: 600;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--shadow-primary);
}

.sport-item.live {
  position: relative;
}

.live-indicator {
  width: 8px;
  height: 8px;
  background: var(--live-indicator);
  border-radius: 50%;
  animation: pulse 2s infinite;
  flex-shrink: 0;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(220, 53, 69, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(220, 53, 69, 0);
  }
}

.badge {
  font-size: 0.7rem;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

/* Responsive Tasarım */
@media (max-width: 768px) {
  .sport-menu-container {
    gap: 0.25rem;
  }
  
  .scroll-btn {
    min-width: 35px;
    height: 35px;
    font-size: 0.875rem;
  }
  
  .sport-item {
    padding: 0.4rem 0.8rem;
    font-size: 0.875rem;
  }
  
  .sport-item .fs-6 {
    font-size: 0.9rem !important;
  }
}

@media (max-width: 576px) {
  .sport-menu-slider .container-fluid {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  
  .sport-item {
    padding: 0.35rem 0.7rem;
    font-size: 0.8rem;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .sport-item,
  .scroll-btn,
  .live-indicator {
    transition: none;
    animation: none;
  }
  
  .sport-menu-scroll {
    scroll-behavior: auto;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .sport-item {
    border-width: 3px;
  }
  
  .sport-item.active {
    outline: 3px solid currentColor;
    outline-offset: 2px;
  }
}
</style> 