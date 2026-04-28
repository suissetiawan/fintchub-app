<template>
  <div class="relative group">
    <span class="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 group-focus-within:text-blue-500 transition-colors">Rp</span>
    <input
      type="text"
      inputmode="numeric"
      :value="displayValue"
      @input="handleInput"
      @blur="handleBlur"
      v-bind="$attrs"
      :class="[
        'w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none dark:text-white transition-all font-black',
        size === 'xl' ? 'text-xl' : size === 'lg' ? 'text-lg' : 'text-base'
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { formatNumber } from '@/utils/amountHelper'

const props = withDefaults(defineProps<{
  modelValue: number | string | null | undefined
  size?: 'base' | 'lg' | 'xl'
}>(), {
  size: 'base'
})

const emit = defineEmits(['update:modelValue'])

const displayValue = ref('')

const format = (val: number | string | null | undefined) => {
  if (val === null || val === undefined || val === '') return ''
  
  let num: number
  if (typeof val === 'string') {
    // If it's a DB decimal string (e.g. "100.00"), parse as float
    if (val.includes('.') && !val.includes(',') && /^\d+\.\d+$/.test(val)) {
      num = parseFloat(val)
    } else {
      // Otherwise it's likely a formatted string or raw digit string
      num = parseInt(val.replace(/\D/g, '')) || 0
    }
  } else {
    num = val
  }
  
  return formatNumber(num, true)
}

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const rawValue = target.value.replace(/\D/g, '')
  const numValue = rawValue ? parseInt(rawValue) : 0
  
  displayValue.value = formatNumber(numValue, true)
  emit('update:modelValue', numValue)
}

const handleBlur = () => {
  displayValue.value = format(props.modelValue)
}

watch(() => props.modelValue, (newVal) => {
  displayValue.value = format(newVal)
}, { immediate: true })

onMounted(() => {
  displayValue.value = format(props.modelValue)
})
</script>
