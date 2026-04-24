<template>
  <Transition name="drawer">
    <div v-if="isOpen" class="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50 backdrop" @click="close"></div>

      <!-- Drawer Content -->
      <div
        :class="[
          'relative w-full max-w-lg bg-white dark:bg-gray-950 rounded-t-[2.5rem] sm:rounded-3xl p-6 shadow-2xl overflow-y-auto drawer-content',
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
import { watch, onUnmounted } from 'vue'

const props = defineProps<{
  isOpen: boolean
  title: string
  heightClass?: string
}>()

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}

// Lock body scroll when drawer is open
watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  document.body.classList.remove('overflow-hidden')
})
</script>

<style scoped>
/* Container transition (fade) */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.5s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

/* Content transition (slide up) */
.drawer-enter-active .drawer-content {
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease;
}

.drawer-leave-active .drawer-content {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}

.drawer-enter-from .drawer-content,
.drawer-leave-to .drawer-content {
  transform: translateY(100%);
  opacity: 0;
}

@media (min-width: 640px) {
  .drawer-enter-from .drawer-content,
  .drawer-leave-to .drawer-content {
    transform: scale(0.95) translateY(20px);
  }
}
</style>
