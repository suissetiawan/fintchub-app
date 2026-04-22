<template>
  <div class="flex min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Desktop Sidebar -->
    <SidebarNav />

    <!-- Main Content Area -->
    <div class="flex flex-col flex-1 lg:ml-[240px]">
      <!-- Mobile Header (hidden on desktop) -->
      <AppHeader class="lg:hidden" />

      <main class="flex-grow pb-20 lg:pb-0">
        <div class="mx-auto max-w-screen-xl px-4 py-4 md:px-6 md:py-6 lg:px-8">
          <router-view />
        </div>
      </main>

      <!-- Mobile Bottom Nav (hidden on desktop) -->
      <BottomNav class="lg:hidden" @add-transaction="handleOpenAddModal" />
    </div>

    <!-- Global Add Transaction Drawer -->
    <TransactionDetailDrawer
      :is-open="showAddDrawer"
      :transaction="null"
      @close="showAddDrawer = false"
    />

    <!-- Toast Notifications Placeholder -->
    <div id="toast-container" class="fixed top-4 right-4 z-[9999]"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SidebarNav from '@/components/layout/SidebarNav.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import TransactionDetailDrawer from '@/components/transactions/TransactionDetailDrawer.vue'

const showAddDrawer = ref(false)

const handleOpenAddModal = () => {
  showAddDrawer.value = true
}
</script>
