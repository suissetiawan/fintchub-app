<template>
  <BaseConfirmDialog
    :is-open="offlineReady || needRefresh"
    :title="needRefresh ? 'Pembaruan Tersedia!' : 'Aplikasi Siap Offline'"
    :message="needRefresh ? 'Versi terbaru sudah siap untuk meningkatkan pengalaman Anda. Klik update sekarang untuk menyegarkan aplikasi.' : 'Aplikasi sekarang dapat diakses tanpa koneksi internet. Anda tetap bisa mencatat keuangan kapan saja!'"
    :confirm-text="needRefresh ? 'Update Sekarang' : 'Oke'"
    cancel-text="Nanti Saja"
    icon="sparkles"
    variant="info"
    @confirm="handleConfirm"
    @cancel="close"
    @close="close"
  />
</template>

<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'
import BaseConfirmDialog from './BaseConfirmDialog.vue'

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW()

const close = () => {
  offlineReady.value = false
  needRefresh.value = false
}

const handleConfirm = () => {
  if (needRefresh.value) {
    updateServiceWorker()
  } else {
    close()
  }
}
</script>
