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
          variant === 'danger' ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-brand-50 dark:bg-brand-900/20 text-brand-500'
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
        <BaseButton 
          @click="onCancel"
          variant="secondary"
          class="flex-1 !rounded-2xl order-2 sm:order-1"
        >
          {{ cancelText }}
        </BaseButton>
        <BaseButton 
          @click="onConfirm"
          :variant="variant === 'danger' ? 'danger' : 'primary'"
          class="flex-1 !rounded-2xl order-1 sm:order-2"
        >
          {{ confirmText }}
        </BaseButton>
      </div>
    </template>
  </BaseModalLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Trash2, AlertCircle, Info, Sparkles } from 'lucide-vue-next'
import BaseModalLayout from './BaseModalLayout.vue'
import BaseButton from './BaseButton.vue'

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

