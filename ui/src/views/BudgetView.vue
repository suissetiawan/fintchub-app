<template>
  <div class="space-y-5">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Budget</h1>
      <div class="flex items-center gap-2">
        <button
          @click="confirmAutoGenerate"
          class="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 font-bold rounded-xl transition-all active:scale-95 text-sm sm:text-base"
          title="Salin dari bulan lalu (atau template jika belum ada data)"
        >
          <Sparkles :size="18" /> Auto Generate
        </button>
        <button
          @click="openAddDrawer"
          class="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-sm sm:text-base"
        >
          <Plus :size="20" /> Tambah Budget
        </button>
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
      <button
        @click="openAddDrawer"
        class="mt-6 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
      >
        Tambah Budget
      </button>
    </div>

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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Plus, Edit2, Trash2, Wallet, Sparkles } from 'lucide-vue-next'
import { useBudgetStore, type BudgetWithUsage } from '@/stores/budget'
import { useCategoryStore } from '@/stores/category'
import { useTransactionStore } from '@/stores/transaction'
import { useSettingStore } from '@/stores/setting'
import { useUiStore } from '@/stores/ui'
import BudgetFormDrawer from '@/components/budget/BudgetFormDrawer.vue'
import BaseSkeleton from '@/components/common/BaseSkeleton.vue'
import BaseConfirmDialog from '@/components/common/BaseConfirmDialog.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
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
    (b) => b.month === selectedMonth.value && b.year === selectedYear.value
  )
})

const isDrawerOpen = ref(false)
const selectedBudget = ref<BudgetWithUsage | null>(null)

const fetchUsageData = async () => {
  await settingStore.fetchSettings()
  const periodType = (settingStore.settings['monitor_period_type'] as any) || 'calendar'
  const paydayDate = parseInt(settingStore.settings['monitor_payday_date'] || '25')

  const { startDate, endDate } = getMonitoringDateRange(
    selectedMonth.value,
    selectedYear.value,
    periodType,
    paydayDate
  )

  transactionStore.fetchExpensesByCategoryForMonth({ startDate, endDate })
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
