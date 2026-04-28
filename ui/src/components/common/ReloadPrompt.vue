<template>
  <BaseConfirmDialog
    :is-open="offlineReady || needRefresh"
    :title="needRefresh ? 'Pembaruan Tersedia!' : 'Aplikasi Siap Offline'"
    :message="needRefresh ? 'Versi terbaru sudah siap untuk meningkatkan pengalaman Anda. Klik update sekarang untuk menyegarkan aplikasi.' : 'Aplikasi sekarang dapat diakses tanpa koneksi internet. Anda tetap bisa mencatat keuangan kapan saja!'"
    :confirm-text="needRefresh ? 'Update Sekarang' : 'Oke'"
    cancel-text="Nanti Saja"
    icon="sparkles"
    variant="info"
    :loading="isUpdating"
    @confirm="handleConfirm"
    @cancel="close"
    @close="close"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import BaseConfirmDialog from './BaseConfirmDialog.vue'

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW({
  onRegistered(r) {
    // Check for updates every 1 hour
    r && setInterval(() => {
      r.update()
    }, 60 * 60 * 1000)
  },
})

const isUpdating = ref(false)

const close = () => {
  offlineReady.value = false
  needRefresh.value = false
  isUpdating.value = false
}

const handleConfirm = async () => {
  if (needRefresh.value) {
    isUpdating.value = true
    // Visual feedback delay
    await new Promise(resolve => setTimeout(resolve, 800))
    updateServiceWorker(true)
  } else {
    close()
  }
}

onMounted(() => {
  // Manual check on mount for iOS standalone mode
  if (window.matchMedia('(display-mode: standalone)').matches) {
    updateServiceWorker()
  }
})
</script>
