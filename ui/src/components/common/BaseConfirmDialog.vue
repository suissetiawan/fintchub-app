<template>
  <BaseModalLayout
    :is-open="isOpen"
    :show-title="false"
    :show-close="false"
    size="sm"
    @close="onCancel"
  >
    <div class="flex flex-col items-center text-center">
      <!-- Icon based on type -->
      <div 
        :class="[
          'w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-colors',
          variant === 'danger' ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-500'
        ]"
      >
        <slot name="icon">
          <component :is="iconComponent" :size="32" />
        </slot>
      </div>
      
      <h3 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
        {{ title }}
      </h3>
      
      <div class="text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-2 leading-relaxed px-2">
        <slot>{{ message }}</slot>
      </div>
    </div>

    <template #footer>
      <div class="flex flex-col sm:flex-row gap-3 w-full">
        <button 
          @click="onCancel"
          class="flex-1 py-4 sm:py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl transition-all active:scale-95 order-2 sm:order-1"
        >
          {{ cancelText }}
        </button>
        <button 
          @click="onConfirm"
          :class="[
            'flex-1 py-4 sm:py-3 px-4 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 order-1 sm:order-2',
            variant === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
          ]"
        >
          {{ confirmText }}
        </button>
      </div>
    </template>
  </BaseModalLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Trash2, AlertCircle, Info, Sparkles } from 'lucide-vue-next'
import BaseModalLayout from './BaseModalLayout.vue'

const props = withDefaults(defineProps<{
  isOpen: boolean
  title: string
  message?: string
  confirmText?: string
  cancelText?: string
  variant?: 'info' | 'danger' | 'success'
  icon?: 'trash' | 'alert' | 'info' | 'sparkles'
}>(), {
  message: '',
  confirmText: 'Konfirmasi',
  cancelText: 'Batal',
  variant: 'info',
  icon: 'info'
})

const emit = defineEmits(['confirm', 'cancel', 'close'])

const iconComponent = computed(() => {
  switch (props.icon) {
    case 'trash': return Trash2
    case 'alert': return AlertCircle
    case 'sparkles': return Sparkles
    default: return Info
  }
})

const onConfirm = () => {
  emit('confirm')
}

const onCancel = () => {
  emit('cancel')
}
</script>

