<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800 lg:hidden pb-[env(safe-area-inset-bottom)]"
  >
    <div class="flex items-center justify-around h-20">
      <router-link
        to="/"
        class="flex flex-col items-center justify-center w-full h-full transition-all duration-200"
        :class="isActive('/') ? 'text-brand-600 dark:text-brand-500 scale-105 font-bold' : 'text-gray-500 dark:text-gray-400'"
      >
        <LayoutDashboard :size="isActive('/') ? 26 : 24" />
        <span class="text-xs mt-1">Home</span>
      </router-link>

      <router-link
        to="/transactions"
        class="flex flex-col items-center justify-center w-full h-full transition-all duration-200"
        :class="isActive('/transactions') ? 'text-brand-600 dark:text-brand-500 scale-105 font-bold' : 'text-gray-500 dark:text-gray-400'"
      >
        <History :size="isActive('/transactions') ? 26 : 24" />
        <span class="text-xs mt-1">History</span>
      </router-link>

      <!-- FAB in Center -->
      <div class="relative -mt-10">
        <BaseButton
          @click="$emit('add-transaction')"
          class="!w-16 !h-16 !rounded-full !p-0 border-4 border-white dark:border-gray-900 shadow-xl"
        >
          <Plus :size="32" />
        </BaseButton>
      </div>

      <router-link
        to="/budget"
        class="flex flex-col items-center justify-center w-full h-full transition-all duration-200"
        :class="isActive('/budget') ? 'text-brand-600 dark:text-brand-500 scale-105 font-bold' : 'text-gray-500 dark:text-gray-400'"
      >
        <Wallet :size="isActive('/budget') ? 26 : 24" />
        <span class="text-xs mt-1">Budget</span>
      </router-link>

      <router-link
        to="/more"
        class="flex flex-col items-center justify-center w-full h-full transition-all duration-200"
        :class="isActive('/more') ? 'text-brand-600 dark:text-brand-500 scale-105 font-bold' : 'text-gray-500 dark:text-gray-400'"
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
import BaseButton from '@/components/common/BaseButton.vue'

const route = useRoute()

defineEmits(['add-transaction'])

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>
