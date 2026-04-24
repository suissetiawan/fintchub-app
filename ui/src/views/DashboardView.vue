<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <div class="flex items-center gap-2">
        <button
          @click="settingStore.toggleHideAmounts()"
          class="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          title="Toggle visibility"
        >
          <Eye v-if="!settingStore.hideAmounts" :size="18" />
          <EyeOff v-else :size="18" />
        </button>
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ currentDate }}</span>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
          <div class="p-3 bg-blue-50 text-blue-600 rounded-xl dark:bg-blue-900/20">
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
        class="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-bold text-gray-500 dark:text-gray-400">Daily Spending</p>
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
      </div>
    </div>

    <!-- Budget Overview -->
    <div
      v-if="budgetOverview.length > 0"
      class="p-3 sm:p-5 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Budget Bulan Ini</h3>
        <router-link
          to="/budget"
          class="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full text-xs font-bold transition-all active:scale-95 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400"
        >
          Lihat Semua <ChevronRight :size="14" />
        </router-link>
      </div>
      <div class="space-y-3">
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
      <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Financial Breakdown</h3>
      <div class="h-[300px] flex justify-center">
        <Doughnut :data="chartData" :options="chartOptions" />
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
        <router-link
          to="/transactions"
          class="flex items-center gap-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full text-xs font-bold transition-all active:scale-95 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400"
        >
          View All <ChevronRight :size="14" />
        </router-link>
      </div>
      <div class="space-y-3">
        <TransactionItem
          v-for="t in recentTransactions"
          :key="t.id"
          :transaction="t"
          :clickable="false"
        />
      </div>
    </div>

    <!-- Floating Action Button -->
    <button
      @click="openNewTransaction"
      class="fixed bottom-24 right-6 md:bottom-10 md:right-10 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 z-40"
    >
      <Plus :size="24" />
    </button>

    <!-- Transaction Detail Drawer -->
    <TransactionDetailDrawer
      :is-open="isDrawerOpen"
      :transaction="selectedTransaction"
      @close="closeDrawer"
      @success="handleTransactionSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Wallet, TrendingDown, ChevronRight, Plus, Calendar, Eye, EyeOff } from 'lucide-vue-next'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js'
import { useDashboardStore } from '@/stores/dashboard'
import { useTransactionStore, type Transaction } from '@/stores/transaction'
import { useBudgetStore } from '@/stores/budget'
import { useSettingStore } from '@/stores/setting'
import { getFontSizeClass, formatNumber } from '@/utils/amountHelper'
import TransactionItem from '@/components/transactions/TransactionItem.vue'
import TransactionDetailDrawer from '@/components/transactions/TransactionDetailDrawer.vue'

ChartJS.register(ArcElement, Title, Tooltip, Legend)

const dashboardStore = useDashboardStore()
const transactionStore = useTransactionStore()
const budgetStore = useBudgetStore()
const settingStore = useSettingStore()

const isDrawerOpen = ref(false)
const selectedTransaction = ref<Transaction | null>(null)

const openNewTransaction = () => {
  selectedTransaction.value = null
  isDrawerOpen.value = true
}

const closeDrawer = () => {
  isDrawerOpen.value = false
}

const loadDashboardData = async () => {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = String(now.getFullYear())
  await Promise.all([
    dashboardStore.fetchDashboardData(),
    transactionStore.fetchTransactions({ limit: '5' } as any),
    budgetStore.fetchBudgets({ month, year }),
    transactionStore.fetchExpensesByCategoryForMonth(month, year),
  ])
}

const handleTransactionSuccess = async () => {
  await loadDashboardData()
}

const budgetOverview = computed(() => budgetStore.budgetsForCurrentMonth.slice(0, 5))

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

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        padding: 24,
        font: {
          family: 'Outfit',
          size: 11,
          weight: '500' as any,
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
