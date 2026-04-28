<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, watch, computed } from 'vue'
import { useSettingStore } from '@/stores/setting'

type Theme = 'light' | 'dark'

const settingStore = useSettingStore()
const theme = ref<Theme>('light')
const isInitialized = ref(false)

const isDarkMode = computed(() => theme.value === 'dark')

const themes: Record<string, Record<string, string>> = {
  blue: {
    '50': '#eff6ff', '100': '#dbeafe', '200': '#bfdbfe', '300': '#93c5fd', '400': '#60a5fa',
    '500': '#3b82f6', '600': '#2563eb', '700': '#1d4ed8', '800': '#1e40af', '900': '#1e3a8a', '950': '#172554'
  },
  emerald: {
    '50': '#ecfdf5', '100': '#d1fae5', '200': '#a7f3d0', '300': '#6ee7b7', '400': '#34d399',
    '500': '#10b981', '600': '#059669', '700': '#047857', '800': '#065f46', '900': '#064e3b', '950': '#022c22'
  },
  pink: {
    '50': '#fdf2f8', '100': '#fce7f3', '200': '#fbcfe8', '300': '#f9a8d4', '400': '#f472b6',
    '500': '#ec4899', '600': '#db2777', '700': '#be185d', '800': '#9d174d', '900': '#831843', '950': '#500724'
  },
  violet: {
    '50': '#f5f3ff', '100': '#ede9fe', '200': '#ddd6fe', '300': '#c4b5fd', '400': '#a78bfa',
    '500': '#8b5cf6', '600': '#7c3aed', '700': '#6d28d9', '800': '#5b21b6', '900': '#4c1d95', '950': '#2e1065'
  },
  amber: {
    '50': '#fffbeb', '100': '#fef3c7', '200': '#fde68a', '300': '#fcd34d', '400': '#fbbf24',
    '500': '#f59e0b', '600': '#d97706', '700': '#b45309', '800': '#92400e', '900': '#78350f', '950': '#451a03'
  }
}

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

onMounted(async () => {
  const savedTheme = localStorage.getItem('theme') as Theme | null
  const initialTheme = savedTheme || 'light' // Default to light theme

  theme.value = initialTheme
  isInitialized.value = true
  await settingStore.fetchSettings()
})

const currentColorTheme = computed(() => settingStore.settings['color_theme'] || 'blue')

watch([theme, isInitialized, currentColorTheme], ([newTheme, newIsInitialized, newColorTheme]) => {
  if (newIsInitialized) {
    localStorage.setItem('theme', newTheme)
    
    // Update color theme variables
    const selectedThemeColors = themes[newColorTheme] || themes.blue
    const root = document.documentElement
    
    Object.entries(selectedThemeColors).forEach(([shade, hex]) => {
      root.style.setProperty(`--color-brand-${shade}`, hex)
    })

    // Update theme-color meta tags for status bar support
    // Priority: White for light mode (matching AppHeader), Dark gray-950 for dark mode
    const themeColor = newTheme === 'dark' ? '#030712' : '#ffffff'
    const metaTags = document.querySelectorAll('meta[name="theme-color"]')
    metaTags.forEach((meta) => {
      meta.setAttribute('content', themeColor)
    })

    // Update Apple specific status bar style
    const appleStatusTag = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
    if (appleStatusTag) {
      appleStatusTag.setAttribute('content', newTheme === 'dark' ? 'black-translucent' : 'default')
    }

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}, { immediate: true })

provide('theme', {
  isDarkMode,
  toggleTheme,
})
</script>

<script lang="ts">
import { inject } from 'vue'

export function useTheme() {
  const theme = inject('theme')
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return theme
}
</script>
