<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
        <!-- Backdrop -->
        <div 
          @click="onClose" 
          @touchmove.prevent
          class="absolute inset-0 bg-black/60 backdrop shadow-inner"
        ></div>
        
        <!-- Modal Content -->
        <div 
          :class="[
            'relative bg-white dark:bg-gray-950 w-full shadow-2xl overflow-hidden modal-content flex flex-col',
            size === 'sm' ? 'sm:max-w-sm rounded-t-[2.5rem] sm:rounded-3xl' : 
            size === 'lg' ? 'sm:max-w-lg rounded-t-[2.5rem] sm:rounded-3xl' : 
            'sm:max-w-md rounded-t-[2.5rem] sm:rounded-3xl'
          ]"
          :style="customHeight ? { height: customHeight } : {}"
        >
          <!-- Mobile Handle -->
          <div class="sm:hidden flex justify-center py-4 shrink-0">
            <div class="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
          </div>

          <!-- Header -->
          <div v-if="showTitle && title" class="flex items-center justify-between px-6 sm:px-8 pb-3 pt-2 sm:pt-4 shrink-0">
            <h2 
              :class="[
                'font-bold text-gray-900 dark:text-white tracking-tight',
                size === 'sm' ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'
              ]"
            >
              {{ title }}
            </h2>
            <button
              v-if="showClose"
              @click="onClose"
              class="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
            >
              <X :size="size === 'sm' ? 18 : 22" />
            </button>
          </div>

          <!-- Body -->
          <div 
            :class="[
              'flex-1 overflow-y-auto overscroll-contain px-6 sm:px-8 pb-8 custom-scrollbar',
              showTitle && title ? 'pt-2' : 'pt-10 sm:pt-12'
            ]"
          >
            <slot></slot>
          </div>

          <!-- Footer Slot (Optional) -->
          <div v-if="$slots.footer" class="px-6 sm:px-8 py-4 border-t border-gray-100 dark:border-gray-800 shrink-0">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
import { ref as globalRef } from 'vue'
// Shared counter across all instances of BaseModalLayout
const openModalsCount = globalRef(0)
</script>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { watch, onUnmounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  isOpen: boolean
  title?: string
  showTitle?: boolean
  showClose?: boolean
  size?: 'sm' | 'md' | 'lg'
  customHeight?: string
}>(), {
  title: '',
  showTitle: true,
  showClose: true,
  size: 'md',
})

const emit = defineEmits(['close'])

const onClose = () => {
  emit('close')
}

const wasOpen = ref(false)

// Scroll lock with global counter
watch(() => props.isOpen, (newVal) => {
  if (newVal && !wasOpen.value) {
    wasOpen.value = true
    openModalsCount.value++
    if (openModalsCount.value === 1) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    }
  } else if (!newVal && wasOpen.value) {
    wasOpen.value = false
    openModalsCount.value = Math.max(0, openModalsCount.value - 1)
    if (openModalsCount.value === 0) {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }
}, { immediate: true })

onUnmounted(() => {
  if (wasOpen.value) {
    openModalsCount.value = Math.max(0, openModalsCount.value - 1)
    if (openModalsCount.value === 0) {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }
})
</script>

<style scoped>
/* Main container transition (backdrop fade) */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Content transition (slide up on mobile, scale on desktop) */
.modal-enter-active .modal-content {
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.25s ease;
}

.modal-leave-active .modal-content {
  transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.15s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: translateY(100%);
  opacity: 0;
}

@media (min-width: 640px) {
  .modal-enter-from .modal-content,
  .modal-leave-to .modal-content {
    transform: scale(0.98) translateY(5px);
    opacity: 0;
  }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
}
</style>
