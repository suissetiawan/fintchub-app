<template>
  <header
    class="sticky top-0 flex w-full bg-white border-b border-gray-100 z-40 dark:border-gray-800 dark:bg-gray-950/80 backdrop-blur-md"
  >
    <div class="flex items-center justify-between w-full px-5 py-3">
      <!-- Left: Profile & Greeting -->
      <router-link to="/profile" class="flex items-center gap-3 active:scale-95 transition-transform">
        <div
          class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm"
        >
          {{ userInitials }}
        </div>
        <div class="flex flex-col">
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400 leading-tight">
            {{ greeting }},
          </span>
          <span class="text-sm font-bold text-gray-900 dark:text-white leading-tight truncate max-w-[150px]">
            {{ authStore.displayName }}
          </span>
        </div>
      </router-link>

      <!-- Right: Theme Toggler -->
      <div class="flex items-center">
        <ThemeToggler />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ThemeToggler from '@/components/common/ThemeToggler.vue'

const authStore = useAuthStore()

const userInitials = computed(() => authStore.userInitials)

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 11) return 'Selamat pagi'
  if (hour < 15) return 'Selamat siang'
  if (hour < 18) return 'Selamat sore'
  return 'Selamat malam'
})
</script>
