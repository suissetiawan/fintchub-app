<template>
  <PullToRefresh :on-refresh="handleRefresh">
    <div class="space-y-5">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white leading-tight">Budget</h1>
        <div v-if="periodRange" class="flex items-center gap-1.5 mt-1 text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 rounded-full w-fit">
          <Calendar :size="12" stroke-width="3" />
          <span class="text-[10px] font-bold uppercase tracking-wider">{{ periodRange }}</span>
        </div>
      </div>
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <BaseButton
          @click="confirmAutoGenerate"
          variant="secondary"
          class="flex-1 sm:flex-none"
          title="Salin dari bulan lalu (atau template jika belum ada data)"
        >
          <template #icon-left><Sparkles :size="18" /></template>
          Auto Generate
        </BaseButton>
        <BaseButton
          @click="openAddDrawer"
          class="flex-1 sm:flex-none"
        >
          <template #icon-left><Plus :size="20" /></template>
          Tambah Budget
        </BaseButton>
      </div>
    </div>

    <!-- Month/Year filter -->
    <div class="flex gap-3 items-center flex-wrap">
      <span class="text-sm font-bold text-gray-500 dark:text-gray-400">Periode:</span>
      <div class="w-36">
        <BaseSelect
          v-model="selectedMonth"
          :options="months"
        />
      </div>
      <div class="w-28">
        <BaseSelect
          v-model="selectedYear"
          :options="years"
        />
      </div>
    </div>

    <!-- Allocation Summary Card -->
    <div 
      v-if="!budgetStore.loading"
      class="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm mb-6"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ringkasan Alokasi</h3>
        <span 
          class="text-xs font-bold px-2 py-0.5 rounded-full"
          :class="remainingToAllocate < 0 ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-brand-100 text-brand-600 dark:bg-brand-900/30'"
        >
          {{ remainingToAllocate < 0 ? 'Over Allocated' : 'Balanced' }}
        </span>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-[10px] text-gray-400 uppercase font-bold">Total Income</p>
          <p class="text-lg font-bold text-gray-900 dark:text-white">Rp {{ formatNumber(transactionStore.summary.income || 0) }}</p>
        </div>
        <div class="text-right">
          <p class="text-[10px] text-gray-400 uppercase font-bold">Total Alokasi</p>
          <p class="text-lg font-bold text-brand-600">Rp {{ formatNumber(totalAllocated) }}</p>
        </div>
      </div>

      <!-- Progress Bar for Allocation -->
      <div class="mt-4">
        <div class="flex items-center justify-between mb-1.5 text-xs">
          <span class="text-gray-500">Persentase Alokasi</span>
          <span :class="allocationPercentage > 100 ? 'text-red-500 font-bold' : 'text-gray-700 dark:text-gray-300 font-bold'">
            {{ allocationPercentage.toFixed(1) }}%
          </span>
        </div>
        <div class="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-500"
            :class="allocationPercentage > 100 ? 'bg-red-500' : 'bg-brand-500'"
            :style="{ width: Math.min(allocationPercentage, 100) + '%' }"
          />
        </div>
        <p v-if="remainingToAllocate !== 0" class="mt-2 text-[11px] italic" :class="remainingToAllocate < 0 ? 'text-red-400' : 'text-gray-400'">
          {{ remainingToAllocate < 0 
              ? `Alokasi melebihi income sebesar Rp ${formatNumber(Math.abs(remainingToAllocate))}` 
              : `Masih ada Rp ${formatNumber(remainingToAllocate)} yang belum dialokasikan` 
          }}
        </p>
      </div>
    </div>

    <div v-if="budgetStore.loading" class="space-y-4">
      <div v-for="i in 4" :key="i" class="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div class="flex justify-between items-start">
           <div class="flex-1 space-y-3">
              <BaseSkeleton width="w-32" height="h-5" />
              <BaseSkeleton width="w-44" height="h-4" />
              <BaseSkeleton width="w-full" height="h-2" rounded="full" />
              <div class="flex gap-3">
                 <BaseSkeleton width="w-16" height="h-4" rounded="full" />
                 <BaseSkeleton width="w-24" height="h-4" />
              </div>
           </div>
           <div class="flex gap-2">
              <BaseSkeleton width="w-8" height="h-8" rounded="xl" />
              <BaseSkeleton width="w-8" height="h-8" rounded="xl" />
           </div>
        </div>
      </div>
    </div>

    <div v-else-if="filteredBudgetsWithUsage.length > 0" class="space-y-4">
      <div
        v-for="b in filteredBudgetsWithUsage"
        :key="b.id"
        class="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <h3 class="font-bold text-gray-900 dark:text-white">{{ b.categoryName }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Rp {{ formatNumber(b.used, true) }} / Rp {{ formatNumber(b.amount, true) }}
            </p>
            <div class="mt-2 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div
                :class="[
                  'h-full rounded-full transition-all',
                  b.status === 'exceeded'
                    ? 'bg-red-500'
                    : b.status === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-green-500',
                ]"
                :style="{ width: Math.min(b.percentUsed, 100) + '%' }"
              />
            </div>
            <div class="mt-2 flex items-center gap-2 flex-wrap">
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
                {{ statusLabel(b.status) }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                Sisa: Rp {{ formatNumber(b.remaining, true) }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <button
              @click="openEditDrawer(b)"
              class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
              title="Edit"
            >
              <Edit2 :size="18" />
            </button>
            <button
              @click="handleDeleteBudget(b)"
              class="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
              title="Hapus"
            >
              <Trash2 :size="18" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="py-16 sm:py-20 flex flex-col items-center bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800"
    >
      <div class="p-5 bg-gray-50 dark:bg-gray-800 rounded-full mb-4">
        <Wallet :size="40" class="text-gray-400" />
      </div>
      <h3 class="font-bold text-gray-900 dark:text-white">Belum ada budget</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center max-w-xs">
        Buat budget per kategori untuk memantau pengeluaran Anda
      </p>
      <BaseButton
        @click="openAddDrawer"
        class="mt-6 px-6"
      >
        Tambah Budget
      </BaseButton>
    </div>
    </div>
  </PullToRefresh>

  <BudgetFormDrawer
    :is-open="isDrawerOpen"
    :budget="selectedBudget"
    :month="selectedMonth"
    :year="selectedYear"
    @close="closeDrawer"
    @saved="onSaved"
  />

  <!-- Delete Confirmation -->
  <BaseConfirmDialog
    :is-open="isDeleteDialogOpen"
    title="Hapus Budget?"
    confirm-text="Hapus"
    variant="danger"
    icon="trash"
    @confirm="executeDelete"
    @cancel="closeDeleteDialog"
  >
    Anda akan menghapus budget <span class="font-bold text-gray-900 dark:text-white">"{{ budgetToDelete?.categoryName }}"</span>. Tindakan ini tidak dapat dibatalkan.
  </BaseConfirmDialog>

  <!-- Auto Generate Confirmation -->
  <BaseConfirmDialog
    :is-open="isAutoGenerateOpen"
    title="Auto Generate Budget?"
    confirm-text="Ya, Salin"
    icon="sparkles"
    @confirm="executeAutoGenerate"
    @cancel="isAutoGenerateOpen = false"
  >
    Salin semua pengaturan budget dari <span class="font-bold text-gray-900 dark:text-white">{{ autoGenerateSource }}</span> ke <span class="font-bold text-gray-900 dark:text-white">{{ autoGenerateTarget }}</span>?<br><br>
    <span class="text-xs text-gray-400">Budget yang sudah ada tidak akan ditimpa.</span>
  </BaseConfirmDialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Plus, Edit2, Trash2, Wallet, Sparkles, Calendar } from 'lucide-vue-next'
import { useBudgetStore, type BudgetWithUsage } from '@/stores/budget'
import { useCategoryStore } from '@/stores/category'
import { useTransactionStore } from '@/stores/transaction'
import { useSettingStore } from '@/stores/setting'
import { useUiStore } from '@/stores/ui'
import BudgetFormDrawer from '@/components/budget/BudgetFormDrawer.vue'
import BaseSkeleton from '@/components/common/BaseSkeleton.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseConfirmDialog from '@/components/common/BaseConfirmDialog.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import PullToRefresh from '@/components/common/PullToRefresh.vue'
import { formatNumber } from '@/utils/amountHelper'
import { getMonitoringDateRange } from '@/utils/dateHelper'

const uiStore = useUiStore()

const budgetStore = useBudgetStore()
const categoryStore = useCategoryStore()
const transactionStore = useTransactionStore()
const settingStore = useSettingStore()

const now = new Date()
const selectedMonth = ref(String(now.getMonth() + 1).padStart(2, '0'))
const selectedYear = ref(String(now.getFullYear()))

const months = [
  { value: '01', label: 'Januari' },
  { value: '02', label: 'Februari' },
  { value: '03', label: 'Maret' },
  { value: '04', label: 'April' },
  { value: '05', label: 'Mei' },
  { value: '06', label: 'Juni' },
  { value: '07', label: 'Juli' },
  { value: '08', label: 'Agustus' },
  { value: '09', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' },
]
const years = computed(() => {
  const y = now.getFullYear()
  return [String(y), String(y - 1), String(y - 2)]
})

const filteredBudgetsWithUsage = computed(() => {
  return budgetStore.budgetsWithUsage.filter(
    (b) => String(b.month).padStart(2, '0') === selectedMonth.value && 
           String(b.year) === selectedYear.value
  )
})

const isDrawerOpen = ref(false)
const selectedBudget = ref<BudgetWithUsage | null>(null)
const periodRange = ref('')

const totalAllocated = computed(() => {
  return filteredBudgetsWithUsage.value.reduce((sum, b) => sum + parseFloat(b.amount as any || 0), 0)
})

const remainingToAllocate = computed(() => {
  return (transactionStore.summary.income || 0) - totalAllocated.value
})

const allocationPercentage = computed(() => {
  const income = transactionStore.summary.income || 0
  if (income === 0) return 0
  return (totalAllocated.value / income) * 100
})

const formatPeriodRange = (start: string, end: string) => {
  const s = new Date(start)
  const e = new Date(end)
  const opt: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
  return `${s.toLocaleDateString('id-ID', opt)} - ${e.toLocaleDateString('id-ID', opt)}`
}

const fetchUsageData = async () => {
  await settingStore.fetchSettings()
  const periodType = (settingStore.settings['monitor_period_type'] as any) || 'calendar'
  const paydayDate = parseInt(settingStore.settings['monitor_payday_date'] || '25')

  const now = new Date()
  const isCurrent = 
    selectedMonth.value === String(now.getMonth() + 1).padStart(2, '0') &&
    selectedYear.value === String(now.getFullYear())

  const { startDate, endDate } = getMonitoringDateRange(
    selectedMonth.value,
    selectedYear.value,
    periodType,
    paydayDate,
    isCurrent ? now.getDate() : undefined
  )
  periodRange.value = formatPeriodRange(startDate, endDate)

  await Promise.all([
    transactionStore.fetchExpensesByCategoryForMonth({ startDate, endDate }),
    transactionStore.fetchTransactions({ startDate, endDate, limit: '1' } as any)
  ])
}

const handleRefresh = async () => {
  await Promise.all([
    budgetStore.fetchBudgets({ month: selectedMonth.value, year: selectedYear.value }),
    fetchUsageData()
  ])
}

watch(
  [selectedMonth, selectedYear],
  () => {
    budgetStore.fetchBudgets({ month: selectedMonth.value, year: selectedYear.value })
    fetchUsageData()
  },
  { immediate: false }
)

function openAddDrawer() {
  selectedBudget.value = null
  isDrawerOpen.value = true
}

function openEditDrawer(b: BudgetWithUsage) {
  selectedBudget.value = b
  isDrawerOpen.value = true
}

function closeDrawer() {
  isDrawerOpen.value = false
  selectedBudget.value = null
}

function onSaved() {
  closeDrawer()
  budgetStore.fetchBudgets({ month: selectedMonth.value, year: selectedYear.value })
}

const isDeleteDialogOpen = ref(false)
const budgetToDelete = ref<BudgetWithUsage | null>(null)

function handleDeleteBudget(b: BudgetWithUsage) {
  budgetToDelete.value = b
  isDeleteDialogOpen.value = true
}

function closeDeleteDialog() {
  isDeleteDialogOpen.value = false
  budgetToDelete.value = null
}

async function executeDelete() {
  if (!budgetToDelete.value) return
  
  try {
    const id = budgetToDelete.value.id
    closeDeleteDialog()
    await budgetStore.deleteBudget(id)
    // Refresh list
    await budgetStore.fetchBudgets({ month: selectedMonth.value, year: selectedYear.value })
  } catch (error: any) {
    alert(error.response?.data?.message || 'Gagal menghapus budget.')
    console.error('Delete budget failed:', error)
  }
}

const isAutoGenerateOpen = ref(false)
const autoGenerateSource = ref('')
const autoGenerateTarget = ref('')
const autoGenerateData = ref<any>(null)

function confirmAutoGenerate() {
  const mIndex = months.findIndex((m) => m.value === selectedMonth.value)
  let prevMonth = ''
  let prevYear = selectedYear.value

  if (mIndex === 0) {
    prevMonth = '12'
    prevYear = String(parseInt(selectedYear.value) - 1)
  } else {
    prevMonth = months[mIndex - 1].value
  }

  autoGenerateSource.value = `${months.find((m) => m.value === prevMonth)?.label} ${prevYear}`
  autoGenerateTarget.value = `${months.find((m) => m.value === selectedMonth.value)?.label} ${selectedYear.value}`
  
  autoGenerateData.value = {
    sourceMonth: prevMonth,
    sourceYear: prevYear,
    targetMonth: selectedMonth.value,
    targetYear: selectedYear.value,
  }

  isAutoGenerateOpen.value = true
}

async function executeAutoGenerate() {
  if (!autoGenerateData.value) return
  isAutoGenerateOpen.value = false
  
  try {
    const result = await budgetStore.autoGenerateBudgets(autoGenerateData.value)

    if (result.count === 0) {
      alert('Tidak ada budget baru yang perlu dibuat (semua sudah ada).')
    } else {
      // Potentially show a success toast here later
    }
  } catch (error: any) {
    alert(error.response?.data?.message || 'Gagal generate budget.')
  }
}



function statusLabel(status: string) {
  if (status === 'exceeded') return 'Melebihi'
  if (status === 'warning') return 'Hampir habis'
  return 'Aman'
}

onMounted(() => {
  categoryStore.fetchCategories()
  budgetStore.fetchBudgets({ month: selectedMonth.value, year: selectedYear.value })
  fetchUsageData()
})
</script>
