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
                settingStore.hideAmounts ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'
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
        <div class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h3>
          
          <div class="space-y-4">
            <p class="font-medium text-gray-900 dark:text-white">Color Theme</p>
            <div class="flex flex-wrap gap-4">
              <button
                v-for="(theme, key) in colorThemes"
                :key="key"
                @click="saveTheme(key)"
                class="group relative flex flex-col items-center gap-2"
              >
                <div 
                  :class="[
                    'w-12 h-12 rounded-2xl transition-all duration-300 flex items-center justify-center',
                    theme.bg,
                    selectedTheme === key ? 'ring-4 ring-offset-2 dark:ring-offset-gray-950 scale-110 shadow-lg' : 'hover:scale-105'
                  ]"
                  :style="{ '--tw-ring-color': theme.hex }"
                >
                  <Check v-if="selectedTheme === key" :size="20" class="text-white" />
                </div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-gray-500">{{ theme.name }}</span>
              </button>
            </div>
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
              class="px-4 py-2 bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400 rounded-xl font-bold text-sm hover:bg-brand-100 transition-all active:scale-95"
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

            <div v-if="periodType === 'payday'" class="flex items-center justify-between pl-4 border-l-2 border-brand-100 dark:border-brand-900/50">
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
                class="block w-20 rounded-xl border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 text-center"
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
import { ChevronLeft, Check } from 'lucide-vue-next'
import { useSettingStore } from '@/stores/setting'
import BaseSelect from '@/components/common/BaseSelect.vue'

const settingStore = useSettingStore()

const periodType = ref<'calendar' | 'payday'>('calendar')
const paydayDate = ref<number>(25)
const selectedTheme = ref('blue')

const colorThemes = {
  blue: { name: 'Ocean', bg: 'bg-[#3b82f6]', hex: '#3b82f6' },
  emerald: { name: 'Forest', bg: 'bg-[#10b981]', hex: '#10b981' },
  pink: { name: 'Candy', bg: 'bg-[#ec4899]', hex: '#ec4899' },
  violet: { name: 'Royal', bg: 'bg-[#8b5cf6]', hex: '#8b5cf6' },
  amber: { name: 'Sunset', bg: 'bg-[#f59e0b]', hex: '#f59e0b' },
}

const periodOptions = [
  { label: 'Calendar Month', value: 'calendar' },
  { label: 'Payday to Payday', value: 'payday' }
]

onMounted(async () => {
  await settingStore.fetchSettings()
  periodType.value = (settingStore.settings['monitor_period_type'] as 'calendar' | 'payday') || 'calendar'
  paydayDate.value = parseInt(settingStore.settings['monitor_payday_date'] || '25', 10)
  selectedTheme.value = settingStore.settings['color_theme'] || 'blue'
})

const toggleHide = async () => {
  await settingStore.toggleHideAmounts()
}

const savePeriodSetting = async () => {
  await settingStore.setMonitorPeriod(periodType.value, paydayDate.value)
}

const saveTheme = async (themeKey: string) => {
  selectedTheme.value = themeKey
  await settingStore.saveSetting('color_theme', themeKey)
}
</script>
