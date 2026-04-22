<template>
  <div class="space-y-5">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">More</h1>
    <p class="text-sm text-gray-500 dark:text-gray-400">
      Menu lainnya dan pengaturan
    </p>

    <nav class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <router-link
        v-for="item in menuItems"
        :key="item.href"
        :to="item.href"
        class="flex items-center gap-4 px-5 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div class="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
          <component :is="item.icon" :size="22" />
        </div>
        <div class="flex-1">
          <span class="font-semibold text-gray-900 dark:text-white">{{ item.text }}</span>
          <p v-if="item.description" class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {{ item.description }}
          </p>
        </div>
        <ChevronRight :size="20" class="text-gray-400" />
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { User, Tags, Wallet, Users, ChevronRight } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const menuItems = computed(() => {
  const items = [
    { href: '/profile', icon: User, text: 'Profile', description: 'Edit profil & keluar' },
    { href: '/categories', icon: Tags, text: 'Categories', description: 'Kelola kategori' },
    { href: '/budget', icon: Wallet, text: 'Budget', description: 'Budget & monitoring' },
  ]
  if (authStore.isAdmin) {
    items.push({
      href: '/users',
      icon: Users,
      text: 'User Management',
      description: 'Kelola pengguna',
    })
  }
  return items
})
</script>
