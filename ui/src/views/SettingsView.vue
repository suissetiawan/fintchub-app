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
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Budgeting & Monitoring</h3>
          
          <div class="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800/50">
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

          <div class="py-3 border-b border-gray-50 dark:border-gray-800/50 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Monitoring Period</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Choose how dashboard and budgets are calculated</p>
              </div>
              <div class="w-36">
                <BaseSelect
                  v-model="periodType"
                  :options="periodOptions"
                  size="sm"
                  @update:modelValue="savePeriodSetting"
                />
              </div>
            </div>

            <div v-if="periodType === 'payday'" class="flex items-center justify-between pl-4 border-l-2 border-blue-100 dark:border-blue-900/50">
              <div>
                <p class="font-medium text-sm text-gray-900 dark:text-white">Payday Date</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Budgets will reset on this date (1-28)</p>
              </div>
              <input
                type="number"
                v-model.number="paydayDate"
                @change="savePeriodSetting"
                min="1"
                max="28"
                class="block w-20 rounded-xl border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 text-center"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ChevronLeft } from 'lucide-vue-next'
import { useSettingStore } from '@/stores/setting'
import BaseSelect from '@/components/common/BaseSelect.vue'

const settingStore = useSettingStore()

const periodType = ref<'calendar' | 'payday'>('calendar')
const paydayDate = ref<number>(25)

const periodOptions = [
  { label: 'Calendar Month', value: 'calendar' },
  { label: 'Payday to Payday', value: 'payday' }
]

onMounted(async () => {
  await settingStore.fetchSettings()
  periodType.value = (settingStore.settings['monitor_period_type'] as 'calendar' | 'payday') || 'calendar'
  paydayDate.value = parseInt(settingStore.settings['monitor_payday_date'] || '25', 10)
})

const toggleHide = async () => {
  await settingStore.toggleHideAmounts()
}

const savePeriodSetting = async () => {
  await settingStore.setMonitorPeriod(periodType.value, paydayDate.value)
}
</script>
