<script setup lang="ts">
import {useAuthStore} from "~/store/auth";
import ErrorModal from '~/components/ErrorModal.vue'
import SuccessModal from '~/components/SuccessModal.vue'

const authStore = useAuthStore();
authStore.hydrate();

// Global notifications
const { showErrorModal, showSuccessModal, errorModal, successModal, closeErrorModal, closeSuccessModal, retryLastAction } = useNotifications()

console.log('App.vue - Initial modal state:', { showErrorModal: showErrorModal.value, errorModal })

// Debug modal state
watch(showErrorModal, (newVal) => {
  console.log('App.vue - showErrorModal changed:', newVal, errorModal)
}, { immediate: true })

// export default defineNuxtPlugin((nuxtApp) => {
//   const authStore = useAuthStore();
//   authStore.hydrate();
// });
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator/>
    <div class="container">
      <NuxtPage/>
    </div>
  </NuxtLayout>

  <!-- Debug info -->
  <div v-if="showErrorModal" style="position: fixed; top: 10px; right: 10px; background: red; color: white; padding: 10px; z-index: 10000;">
    Modal should be visible: {{ showErrorModal }}
  </div>

  <!-- Global Error Modal -->
  <ErrorModal 
    :show="showErrorModal"
    :title="errorModal.title"
    :message="errorModal.message"
    :show-retry="errorModal.showRetry"
    @close="closeErrorModal"
    @retry="retryLastAction"
  />

  <!-- Global Success Modal -->
  <SuccessModal 
    :show="showSuccessModal"
    :title="successModal.title"
    :message="successModal.message"
    :show-action="successModal.showAction"
    :action-text="successModal.actionText"
    @close="closeSuccessModal"
    @action="() => successModal.action && successModal.action()"
  />
</template>
