<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800 lg:hidden"
  >
    <div class="flex items-center justify-around h-20">
      <router-link
        to="/"
        class="flex flex-col items-center justify-center w-full h-full transition-all duration-200"
        :class="isActive('/') ? 'text-blue-600 dark:text-blue-500 scale-105 font-bold' : 'text-gray-500 dark:text-gray-400'"
      >
        <LayoutDashboard :size="isActive('/') ? 26 : 24" />
        <span class="text-xs mt-1">Home</span>
      </router-link>

      <router-link
        to="/transactions"
        class="flex flex-col items-center justify-center w-full h-full transition-all duration-200"
        :class="isActive('/transactions') ? 'text-blue-600 dark:text-blue-500 scale-105 font-bold' : 'text-gray-500 dark:text-gray-400'"
      >
        <History :size="isActive('/transactions') ? 26 : 24" />
        <span class="text-xs mt-1">History</span>
      </router-link>

      <!-- FAB in Center -->
      <div class="relative -mt-10">
        <button
          @click="$emit('add-transaction')"
          class="flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 active:scale-95 transition-transform border-4 border-white dark:border-gray-900"
        >
          <Plus :size="32" />
        </button>
      </div>

      <router-link
        to="/budget"
        class="flex flex-col items-center justify-center w-full h-full transition-all duration-200"
        :class="isActive('/budget') ? 'text-blue-600 dark:text-blue-500 scale-105 font-bold' : 'text-gray-500 dark:text-gray-400'"
      >
        <Wallet :size="isActive('/budget') ? 26 : 24" />
        <span class="text-xs mt-1">Budget</span>
      </router-link>

      <router-link
        to="/more"
        class="flex flex-col items-center justify-center w-full h-full transition-all duration-200"
        :class="isActive('/more') ? 'text-blue-600 dark:text-blue-500 scale-105 font-bold' : 'text-gray-500 dark:text-gray-400'"
      >
        <MoreHorizontal :size="isActive('/more') ? 26 : 24" />
        <span class="text-xs mt-1">More</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { LayoutDashboard, History, Plus, Wallet, MoreHorizontal } from 'lucide-vue-next'

const route = useRoute()

defineEmits(['add-transaction'])

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>
