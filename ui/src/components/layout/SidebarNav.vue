<template>
  <aside
    class="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[240px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50"
  >
    <!-- Logo -->
    <div class="flex items-center gap-3 px-5 h-16 border-b border-gray-100 dark:border-gray-800">
      <div class="w-9 h-9 flex items-center justify-center shrink-0">
        <img src="/plain_logo.png" alt="Fincthub Logo" class="w-full h-full object-contain" />
      </div>
      <span class="font-bold text-lg text-sp text-gray-900 dark:text-white tracking-wider uppercase">Fincthub</span>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4 px-3">
      <ul class="space-y-1">
        <li v-for="item in navItems" :key="item.to">
          <router-link
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
            :class="[
              isActive(item.to)
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white',
            ]"
          >
            <component :is="item.icon" :size="20" />
            {{ item.label }}
          </router-link>
        </li>
      </ul>

      <!-- Admin Section -->
      <div v-if="authStore.isAdmin" class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
        <p class="px-3 mb-2 text-xs font-bold text-gray-400 uppercase tracking-widest">Admin</p>
        <ul class="space-y-1">
          <li>
            <router-link
              to="/users"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
              :class="[
                isActive('/users')
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white',
              ]"
            >
              <Users :size="20" />
              User Management
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Bottom: User + Theme -->
    <div class="border-t border-gray-100 dark:border-gray-800 p-3 space-y-2">
      <div class="flex items-center justify-between px-2">
        <ThemeToggler />
        <span class="text-xs text-gray-400">v1.0</span>
      </div>
      <router-link
        to="/profile"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div
          class="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm"
        >
          {{ userInitials }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {{ authStore.displayName }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
            {{ authStore.user?.email }}
          </p>
        </div>
      </router-link>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  History,
  Tags,
  User,
  Users,
  PieChart,
  Settings,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import ThemeToggler from '@/components/common/ThemeToggler.vue'

const route = useRoute()
const authStore = useAuthStore()

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: History, label: 'Transactions' },
  { to: '/budget', icon: PieChart, label: 'Budget' },
  { to: '/categories', icon: Tags, label: 'Categories' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

const userInitials = computed(() => authStore.userInitials)

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>
