<template>
  <PullToRefresh :on-refresh="loadDashboardData">
    <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white leading-tight">Dashboard</h1>
        <div v-if="periodRange" class="flex items-center gap-1.5 mt-1 text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 rounded-full w-fit">
          <Calendar :size="12" stroke-width="3" />
          <span class="text-[10px] font-bold uppercase tracking-wider">{{ periodRange }}</span>
        </div>
      </div>
      <div class="flex items-center gap-2 mt-1">
        <button
          @click="settingStore.toggleHideAmounts()"
          class="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          title="Toggle visibility"
        >
          <Eye v-if="!settingStore.hideAmounts" :size="18" />
          <EyeOff v-else :size="18" />
        </button>
        <span class="text-sm font-bold text-gray-500 dark:text-gray-400">{{ currentDate }}</span>
      </div>
    </div>

    <!-- Summary Cards -->
    <div v-if="dashboardStore.loading" class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div v-for="i in 3" :key="i" class="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
        <div class="flex items-center justify-between">
          <div class="space-y-2">
            <BaseSkeleton width="w-24" height="h-4" />
            <BaseSkeleton width="w-32" height="h-8" rounded="lg" />
          </div>
          <BaseSkeleton width="w-12" height="h-12" rounded="xl" />
        </div>
      </div>
    </div>
    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <!-- Card 1: Total Balance -->
      <div
        class="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-bold text-gray-500 dark:text-gray-400">Total Balance</p>
            <h3
              :class="getFontSizeClass(dashboardStore.summary.balance)"
              class="font-bold mt-1 text-gray-900 dark:text-white"
            >
              Rp {{ formatNumber(dashboardStore.summary.balance) }}
            </h3>
          </div>
          <div class="p-3 bg-brand-50 text-brand-600 rounded-xl dark:bg-brand-900/20">
            <Wallet :size="24" />
          </div>
        </div>
      </div>

      <!-- Card 2: Total Expense (Bulan) -->
      <div
        class="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-bold text-gray-500 dark:text-gray-400">Total Expense</p>
            <h3
              :class="[getFontSizeClass(dashboardStore.summary.expense), 'text-red-600']"
              class="font-bold mt-1"
            >
              Rp {{ formatNumber(dashboardStore.summary.expense) }}
            </h3>
          </div>
          <div class="p-3 bg-red-50 text-red-600 rounded-xl dark:bg-red-900/20">
            <TrendingDown :size="24" />
          </div>
        </div>
      </div>

      <!-- Card 3: Daily Spending -->
      <div
        class="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800 transition-all duration-300"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <p class="text-sm font-bold text-gray-500 dark:text-gray-400">Daily Spending</p>
              <button 
                v-if="dashboardStore.summary.dailyBreakdown?.length > 0"
                @click="isDailySpendingExpanded = !isDailySpendingExpanded"
                class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronDown 
                  :size="14" 
                  class="text-gray-400 transition-transform duration-300"
                  :class="{ 'rotate-180': isDailySpendingExpanded }"
                />
              </button>
            </div>
            <h3
              :class="[getFontSizeClass(dashboardStore.summary.dailySpending), 'text-orange-600']"
              class="font-bold mt-1"
            >
              Rp {{ formatNumber(dashboardStore.summary.dailySpending) }}
            </h3>
          </div>
          <div class="p-3 bg-orange-50 text-orange-600 rounded-xl dark:bg-orange-900/20">
            <Calendar :size="24" />
          </div>
        </div>

        <!-- Breakdown List (Expandable) -->
        <div 
          v-show="isDailySpendingExpanded && dashboardStore.summary.dailyBreakdown?.length > 0"
          class="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800 space-y-2"
        >
          <div 
            v-for="item in dashboardStore.summary.dailyBreakdown" 
            :key="item.category"
            class="flex items-center justify-between text-xs"
          >
            <span class="text-gray-500 dark:text-gray-400">{{ item.category }}</span>
            <span class="font-bold text-gray-700 dark:text-gray-200">Rp {{ formatNumber(item.amount) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Budget Overview -->
    <div
      v-if="dashboardStore.loading || budgetOverview.length > 0"
      class="p-3 sm:p-5 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Budget Bulan Ini</h3>
        <BaseSkeleton v-if="dashboardStore.loading" width="w-24" height="h-6" rounded="full" />
        <router-link
          v-else
          to="/budget"
          class="flex items-center gap-1 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 rounded-full text-xs font-bold transition-all active:scale-95 dark:bg-brand-900/20 dark:hover:bg-brand-900/30 dark:text-brand-400"
        >
          Lihat Semua <ChevronRight :size="14" />
        </router-link>
      </div>

      <div v-if="dashboardStore.loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="flex justify-between items-center py-1">
          <BaseSkeleton width="w-32" height="h-5" />
          <BaseSkeleton width="w-24" height="h-5" />
        </div>
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="b in budgetOverview"
          :key="b.id"
          class="flex flex-col md:flex-row md:items-center md:justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
        >
          <div class="font-medium text-gray-900 dark:text-white">{{ b.categoryName }}</div>
          <div class="flex items-center justify-between gap-2">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              Rp {{ formatNumber(b.used) }} / Rp {{ formatNumber(b.amount) }}
            </span>
            <span
              :class="[
                'text-xs font-bold px-2 py-0.5 rounded-full',
                b.status === 'exceeded'
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30'
                  : b.status === 'warning'
                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30'
                    : 'bg-green-100 text-green-600 dark:bg-green-900/30',
              ]"
            >
              {{
                b.status === 'exceeded'
                  ? 'Melebihi'
                  : b.status === 'warning'
                    ? 'Hampir habis'
                    : 'Aman'
              }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart -->
    <div
      class="p-3 sm:p-5 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Financial Breakdown</h3>
        <div class="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button
            @click="breakdownType = 'EXPENSE'"
            :class="breakdownType === 'EXPENSE' ? 'bg-white dark:bg-gray-700 shadow-sm text-brand-600 font-bold' : 'text-gray-500'"
            class="px-3 py-1 text-[11px] rounded-lg transition-all"
          >
            Expense
          </button>
          <button
            @click="breakdownType = 'INCOME'"
            :class="breakdownType === 'INCOME' ? 'bg-white dark:bg-gray-700 shadow-sm text-green-600 font-bold' : 'text-gray-500'"
            class="px-3 py-1 text-[11px] rounded-lg transition-all"
          >
            Income
          </button>
        </div>
      </div>
      <div v-if="dashboardStore.loading" class="h-[300px] flex flex-col items-center justify-center space-y-6">
        <BaseSkeleton width="w-48" height="h-48" rounded="full" />
        <div class="flex gap-4">
           <BaseSkeleton width="w-20" height="h-4" />
           <BaseSkeleton width="w-20" height="h-4" />
           <BaseSkeleton width="w-20" height="h-4" />
        </div>
      </div>
      <div v-else class="h-[300px] flex justify-center items-center">
        <Doughnut v-if="dashboardStore.breakdown.length > 0" :data="chartData" :options="chartOptions" />
        <div v-else class="text-center py-10">
          <p class="text-sm font-medium text-gray-400">
            Belum ada data {{ breakdownType === 'EXPENSE' ? 'pengeluaran' : 'pemasukan' }} untuk periode ini
          </p>
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
        <BaseSkeleton v-if="transactionStore.loading" width="w-24" height="h-6" rounded="full" />
        <router-link
          v-else
          to="/transactions"
          class="flex items-center gap-1 px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-600 rounded-full text-xs font-bold transition-all active:scale-95 dark:bg-brand-900/20 dark:hover:bg-brand-900/30 dark:text-brand-400"
        >
          View All <ChevronRight :size="14" />
        </router-link>
      </div>
      <div v-if="transactionStore.loading">
        <BaseListSkeleton :count="3" />
      </div>
      <div v-else class="space-y-3">
        <TransactionItem
          v-for="t in recentTransactions"
          :key="t.id"
          :transaction="t"
          :clickable="false"
        />
      </div>
    </div>
  </div>
</PullToRefresh>

<!-- Floating Action Button -->
<BaseButton
  @click="openNewTransaction"
  class="hidden md:flex fixed bottom-24 right-6 md:bottom-10 md:right-10 !rounded-full !p-4 shadow-lg hover:shadow-xl z-40"
>
  <Plus :size="24" />
</BaseButton>

<!-- Transaction Detail Drawer -->
<TransactionDetailDrawer
  :is-open="isDrawerOpen"
  :transaction="selectedTransaction"
  @close="closeDrawer"
  @success="handleTransactionSuccess"
/>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { Wallet, TrendingDown, ChevronRight, ChevronDown, Plus, Calendar, Eye, EyeOff } from 'lucide-vue-next'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend, DoughnutController, type ChartOptions } from 'chart.js'
import { useDashboardStore } from '@/stores/dashboard'
import { useTransactionStore, type Transaction } from '@/stores/transaction'
import { useBudgetStore } from '@/stores/budget'
import { useSettingStore } from '@/stores/setting'
import { getFontSizeClass, formatNumber } from '@/utils/amountHelper'
import { getMonitoringDateRange } from '@/utils/dateHelper'
import TransactionItem from '@/components/transactions/TransactionItem.vue'
import TransactionDetailDrawer from '@/components/transactions/TransactionDetailDrawer.vue'
import BaseSkeleton from '@/components/common/BaseSkeleton.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseListSkeleton from '@/components/common/BaseListSkeleton.vue'
import PullToRefresh from '@/components/common/PullToRefresh.vue'

ChartJS.register(ArcElement, Title, Tooltip, Legend, DoughnutController)

const dashboardStore = useDashboardStore()
const transactionStore = useTransactionStore()
const budgetStore = useBudgetStore()
const settingStore = useSettingStore()

const isDrawerOpen = ref(false)
const isDailySpendingExpanded = ref(false)
const breakdownType = ref<'EXPENSE' | 'INCOME'>('EXPENSE')
const selectedTransaction = ref<Transaction | null>(null)
const periodRange = ref('')

const formatPeriodRange = (start: string, end: string) => {
  const s = new Date(start)
  const e = new Date(end)
  const opt: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
  return `${s.toLocaleDateString('id-ID', opt)} - ${e.toLocaleDateString('id-ID', opt)}`
}

const openNewTransaction = () => {
  selectedTransaction.value = null
  isDrawerOpen.value = true
}

const closeDrawer = () => {
  isDrawerOpen.value = false
}

const loadDashboardData = async () => {
  await settingStore.fetchSettings()
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = String(now.getFullYear())

  const periodType = (settingStore.settings['monitor_period_type'] as any) || 'calendar'
  const paydayDate = parseInt(settingStore.settings['monitor_payday_date'] || '25')

  const { startDate, endDate } = getMonitoringDateRange(month, year, periodType, paydayDate, now.getDate())
  periodRange.value = formatPeriodRange(startDate, endDate)

  await Promise.all([
    dashboardStore.fetchDashboardData({ startDate, endDate, type: breakdownType.value }),
    transactionStore.fetchTransactions({ startDate, endDate, limit: '5' } as any),
    budgetStore.fetchBudgets({ month, year }),
    transactionStore.fetchExpensesByCategoryForMonth({ startDate, endDate }),
  ])
}

watch(breakdownType, () => {
  loadDashboardData()
})

const handleTransactionSuccess = async () => {
  await loadDashboardData()
}

const budgetOverview = computed(() => {
  return [...budgetStore.budgetsForCurrentMonth]
    .sort((a, b) => b.percentUsed - a.percentUsed)
    .slice(0, 5)
})

const currentDate = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })



const chartData = computed(() => ({
  labels: dashboardStore.breakdown.map((b) => b.category),
  datasets: [
    {
      data: dashboardStore.breakdown.map((b) => b.amount),
      backgroundColor: dashboardStore.breakdown.map((b) => b.color),
      hoverOffset: 15,
      borderWidth: 0,
      cutout: '70%',
    },
  ],
}))

const recentTransactions = computed(() => transactionStore.transactions.slice(0, 3))

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 14,
        font: {
          family: 'Plus Jakarta Sans',
          size: 11,
          weight: 500,
        },
        color: '#64748b',
      },
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#1e293b',
      bodyColor: '#1e293b',
      padding: 12,
      borderColor: '#e2e8f0',
      borderWidth: 1,
      displayColors: true,
      titleFont: {
        family: 'Plus Jakarta Sans',
        weight: 'bold',
      },
      bodyFont: {
        family: 'Plus Jakarta Sans',
      },
      callbacks: {
        label: (context: any) => {
          const value = context.raw
          return ` Rp ${new Intl.NumberFormat('id-ID').format(value)}`
        },
      },
    },
  },
}

onMounted(async () => {
  await loadDashboardData()
})
</script>
