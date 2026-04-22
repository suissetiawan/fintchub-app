<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2',
      block ? 'w-full' : '',
      sizeClasses,
      variantClasses,
      disabled ? 'opacity-50 cursor-not-allowed' : '',
    ]"
    @click="$emit('click', $event)"
  >
    <Loader2 v-if="loading" class="animate-spin" :size="20" />
    <template v-else>
      <slot name="icon-left"></slot>
      <slot></slot>
      <slot name="icon-right"></slot>
    </template>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    block?: boolean
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    size: 'md',
    block: false,
    disabled: false,
    loading: false,
  },
)

defineEmits(['click'])

const sizeClasses = computed(() => {
  return props.size === 'sm'
    ? 'py-2 px-3 text-sm'
    : props.size === 'lg'
      ? 'py-4 px-6 text-lg'
      : 'py-3 px-4'
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    case 'danger':
      return 'bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/30'
    default:
      return 'bg-blue-600 hover:bg-blue-700 text-white'
  }
})
</script>
