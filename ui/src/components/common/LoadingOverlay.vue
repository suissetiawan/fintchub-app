<template>
  <Transition name="fade">
    <div
      v-if="uiStore.isLoading"
      class="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-950/80"
    >
      <div class="relative flex flex-col items-center">
        <!-- Spinner -->
        <div
          class="h-12 w-12 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin dark:border-gray-800 dark:border-t-blue-500"
        ></div>

        <!-- Background pulse ring -->
        <div
          class="absolute top-0 h-12 w-12 rounded-full border-4 border-blue-600/20 animate-ping"
        ></div>

        <p class="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300 animate-pulse">
          {{ uiStore.loadingMessage || 'Processing...' }}
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
