<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <router-link
        to="/"
        class="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 shadow-sm transition-all active:scale-95 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <ChevronLeft :size="20" />
      </router-link>
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Settings</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Manage your preferences</p>
      </div>
    </div>

    <!-- Settings Content -->
    <div class="space-y-6">
      <div class="p-5 bg-white rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">General Preferences</h3>
          
          <div class="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800/50">
            <div>
              <p class="font-medium text-gray-900 dark:text-white">Hide Amounts by Default</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Mask balances and transaction amounts</p>
            </div>
            <button
              @click="toggleHide"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                settingStore.hideAmounts ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              ]"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                  settingStore.hideAmounts ? 'translate-x-5' : 'translate-x-0'
                ]"
              ></span>
            </button>
          </div>
        </div>
      </div>

      <div class="p-5 bg-white rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Budgeting</h3>
          
          <div class="flex items-center justify-between py-3">
            <div>
              <p class="font-medium text-gray-900 dark:text-white">Budget Template</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Set default budgets for auto-generation</p>
            </div>
            <router-link
              to="/settings/budget-template"
              class="px-4 py-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-xl font-bold text-sm hover:bg-blue-100 transition-all active:scale-95"
            >
              Configure
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettingStore } from '@/stores/setting'

const settingStore = useSettingStore()

const toggleHide = async () => {
  await settingStore.toggleHideAmounts()
}
</script>
