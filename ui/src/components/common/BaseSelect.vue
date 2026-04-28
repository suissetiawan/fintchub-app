<template>
  <div class="relative" ref="selectRef">
    <div
      @click="toggleDropdown"
      class="flex items-center justify-between w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus-within:ring-2 focus-within:ring-brand-600 cursor-pointer transition-all"
      :class="[
        isOpen ? 'ring-2 ring-brand-600' : '',
        sizeClasses
      ]"
    >
      <span v-if="!selectedOption" class="text-gray-400 dark:text-gray-500 font-medium truncate">
        {{ placeholder }}
      </span>
      <span v-else class="dark:text-white font-bold truncate" :class="textClasses">
        {{ selectedOption.label }}
      </span>
      
      <ChevronDown
        class="text-gray-400 transition-transform duration-200 shrink-0 ml-2"
        :class="{ 'transform rotate-180 text-brand-500': isOpen }"
        :size="iconSize"
      />
    </div>

    <Teleport to="body">
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div
          v-if="isOpen"
          ref="dropdownRef"
          class="fixed z-[9999] bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-1"
          :style="dropdownStyle"
        >
          <ul
            class="overflow-y-auto max-h-60 custom-scrollbar outline-none"
            role="listbox"
          >
            <li
              v-for="item in normalizedOptions"
              :key="item.value"
              @click="selectItem(item)"
              class="relative flex items-center justify-between w-full px-4 py-2.5 cursor-pointer text-sm font-medium transition-colors"
              :class="
                isSelected(item) 
                  ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              "
              role="option"
              :aria-selected="isSelected(item)"
            >
              <span class="truncate">{{ item.label }}</span>
              <Check
                v-if="isSelected(item)"
                class="w-4 h-4 shrink-0"
              />
            </li>
            
            <li v-if="normalizedOptions.length === 0" class="px-4 py-3 text-sm text-center text-gray-500">
              No options available
            </li>
          </ul>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'

import type { CSSProperties } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: any
  options: any[]
  placeholder?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}>(), {
  size: 'md'
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs': return 'px-2 py-1 text-xs rounded-lg'
    case 'sm': return 'px-4 py-2.5 text-sm rounded-xl'
    case 'lg': return 'px-5 py-3.5 text-lg rounded-xl'
    case 'xl': return 'px-6 py-4.5 text-xl rounded-2xl'
    default: return 'px-4 py-3 text-sm rounded-xl'
  }
})

const textClasses = computed(() => {
  return props.size === 'xs' || props.size === 'sm' ? 'text-gray-900' : 'text-gray-900'
  // Actually text-gray-900 is fine for all, but maybe font weight or specific sizes
})

const iconSize = computed(() => {
  switch (props.size) {
    case 'xs': return 14
    case 'sm': return 16
    case 'lg': return 22
    case 'xl': return 26
    default: return 18
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const selectRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const dropdownStyle = ref<CSSProperties>({ top: '0px', left: '0px', width: '0px' })

const updatePosition = () => {
  if (selectRef.value) {
    const rect = selectRef.value.getBoundingClientRect()
    // Check if there's enough space below, otherwise open upwards
    const spaceBelow = window.innerHeight - rect.bottom
    const dropdownHeight = 250 // Approximate max height
    
    if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
      // Open upwards
      dropdownStyle.value = {
        top: `${rect.top - 8}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        transform: 'translateY(-100%)'
      }
    } else {
      // Open downwards
      dropdownStyle.value = {
        top: `${rect.bottom + 8}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        transform: 'none'
      }
    }
  }
}

watch(isOpen, async (val) => {
  if (val) {
    updatePosition()
    // Wait for DOM update
    await nextTick()
    updatePosition()
  }
})

// Normalize options to always be { label: string, value: any }
const normalizedOptions = computed(() => {
  return props.options.map(opt => {
    if (typeof opt === 'object' && opt !== null) {
      return {
        label: opt.label || opt.name || String(opt),
        value: opt.value !== undefined ? opt.value : (opt.id || opt)
      }
    }
    return { label: String(opt), value: opt }
  })
})

const selectedOption = computed(() => {
  return normalizedOptions.value.find(opt => opt.value === props.modelValue)
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectItem = (item: { label: string, value: any }) => {
  emit('update:modelValue', item.value)
  isOpen.value = false
}

const isSelected = (item: { label: string, value: any }) => {
  return item.value === props.modelValue
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  // Close if clicked outside BOTH the trigger AND the teleported dropdown
  if (
    selectRef.value && !selectRef.value.contains(target) &&
    (!dropdownRef.value || !dropdownRef.value.contains(target))
  ) {
    isOpen.value = false
  }
}

const handleScroll = () => {
  if (isOpen.value) {
    updatePosition()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', handleScroll, true) // Use capture phase for all scroll events
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', handleScroll, true)
})
</script>

<style scoped>
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
