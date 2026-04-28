<template>
  <div class="relative" ref="menuRef">
    <div class="flex items-center gap-3">
      <!-- User Button -->
      <button
        @click="isOpen = !isOpen"
        class="flex items-center gap-3 p-1.5 pr-4 rounded-full border border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      >
        <div
          class="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-brand-600 flex items-center justify-center text-white font-bold text-sm shadow-sm"
        >
          {{ userInitials }}
        </div>
        <div class="hidden md:flex flex-col items-start">
          <span class="text-sm font-semibold text-gray-900 dark:text-white leading-none">
            {{ authStore.displayName }}
          </span>
        </div>
        <ChevronDown
          :size="16"
          class="hidden md:block text-gray-400 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
        />
      </button>
    </div>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 z-50 transform origin-top-right transition-all"
    >
      <div class="px-4 py-3 border-b border-gray-50 dark:border-gray-800/50">
        <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {{ authStore.displayName }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{{ authStore.user?.email || '' }}</p>
      </div>

      <div class="py-2">
        <router-link
          to="/profile"
          @click="isOpen = false"
          class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <User :size="18" />
          Profile
        </router-link>
        
        <router-link
          v-for="item in menuItems" 
          :key="item.href"
          :to="item.href"
          @click="isOpen = false"
          class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <component :is="item.icon" :size="18" />
          {{ item.text }}
        </router-link>

        <router-link
          to="/settings"
          @click="isOpen = false"
          class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <Settings :size="18" />
          Settings
        </router-link>
      </div>

      <div class="py-2 border-t border-gray-50 dark:border-gray-800/50">
        <button
          @click="signOut"
          class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
        >
          <LogOut :size="18" />
          Sign out
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown, User, LogOut, Settings, Eye, EyeOff, Settings as SettingsIcon, Users as UsersIcon, PieChart as PieChartIcon } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useSettingStore } from '@/stores/setting'

const router = useRouter()
const authStore = useAuthStore()
const settingStore = useSettingStore()

const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const userInitials = computed(() => authStore.userInitials)

const menuItems = computed(() => {
  const items = [
    { href: '/categories', icon: SettingsIcon, text: 'Categories' },
    { href: '/budget', icon: PieChartIcon, text: 'Budget' },
  ]

  if (authStore.isAdmin) {
    items.push({ href: '/users', icon: UsersIcon, text: 'User Management' })
  }

  return items
})

const signOut = async () => {
  isOpen.value = false
  await authStore.logout()
  router.push('/auth/login')
}

const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
