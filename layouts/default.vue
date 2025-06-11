<template>
    <div class="min-vh-100 d-flex flex-column">
        <!-- Header Bileşeni -->
        <Header />
        
        <!-- Spor Kategorileri Slider -->
        <SportMenuSlider v-model="selectedSport" @sport-change="handleSportChange" />
        
        <!-- Ana İçerik -->
        <main class="flex-grow-1">
            <slot />
        </main>
        
        <!-- Footer Bileşeni -->
        <Footer />
    </div>
</template>

<script lang="ts" setup>
import { ref, provide } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/store/auth'

// Auth store
const { logUserOut } = useAuthStore()
const { authenticated } = storeToRefs(useAuthStore())

// Router
const router = useRouter()

// Spor seçimi
const selectedSport = ref('futbol')

// Provide selected sport to child components
provide('selectedSport', selectedSport)

// Methods
const logout = () => {
  logUserOut()
  router.push('/auth/login')
}

const handleSportChange = (sportId: string) => {
  selectedSport.value = sportId
}
</script>

<style scoped>
/* Layout genel stilleri */
main {
  background-color: #f8f9fa;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  main {
    padding-top: 1rem;
  }
}
</style>