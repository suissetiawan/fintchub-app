<template>
  <div
    :class="[
      'animate-pulse bg-gray-200 dark:bg-gray-800',
      roundedClass,
      heightClass,
      widthClass,
    ]"
  ></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
    height?: string
    width?: string
  }>(),
  {
    rounded: 'md',
    height: 'h-4',
    width: 'w-full',
  },
)

const roundedClass = computed(() => {
  const map = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-[2.5rem]',
    full: 'rounded-full',
  }
  return map[props.rounded]
})

const heightClass = computed(() => props.height)
const widthClass = computed(() => props.width)
</script>
