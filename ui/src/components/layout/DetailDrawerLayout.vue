<template>
  <Transition name="slide-up">
    <div v-if="isOpen" class="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="close"></div>

      <!-- Drawer Content -->
      <div
        :class="[
          'relative w-full max-w-lg bg-white dark:bg-gray-950 rounded-t-[2.5rem] sm:rounded-3xl p-6 shadow-2xl transition-all overflow-y-auto',
          heightClass,
        ]"
      >
        <!-- Handle for mobile -->
        <div
          class="mx-auto w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full mb-6 sm:hidden"
        ></div>

        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ title }}
          </h2>
          <button
            @click="close"
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
          >
            <X :size="24" />
          </button>
        </div>

        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
  title: string
  heightClass?: string
}>()

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

.slide-up-enter-to,
.slide-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}

@media (min-width: 640px) {
  .slide-up-enter-from,
  .slide-up-leave-to {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }

  .slide-up-enter-to,
  .slide-up-leave-from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
