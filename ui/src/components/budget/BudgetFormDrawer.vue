<template>
  <DetailDrawerLayout
    :is-open="isOpen"
    :title="budget ? 'Edit Budget' : 'Tambah Budget'"
    @close="$emit('close')"
    height-class="h-auto max-h-[90vh]"
  >
    <!-- Error Message Banner -->
    <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-900/30 text-sm font-medium flex items-start gap-3">
      <AlertCircle :size="18" class="shrink-0 mt-0.5" />
      <p>{{ errorMessage }}</p>
    </div>

    <form @submit.prevent="handleSave" class="space-y-6">
      <div>
        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Kategori</label>
        <div :class="{ 'opacity-60 pointer-events-none': !!budget }">
          <BaseSelect
            v-model="form.categoryId"
            :options="expenseCategories"
            placeholder="Pilih kategori"
          />
        </div>
        <p v-if="budget" class="mt-1 text-xs text-gray-500 dark:text-gray-400">Kategori tidak dapat diubah</p>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Limit Budget (Rp)</label>
        <BaseAmountInput
          v-model="form.amount"
          size="lg"
          required
          placeholder="Contoh: 2.000.000"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Bulan</label>
          <BaseSelect
            v-model="form.month"
            :options="months"
          />
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tahun</label>
          <BaseSelect
            v-model="form.year"
            :options="yearOptions"
          />
        </div>
      </div>

      <div class="flex flex-col gap-3 pt-3">
        <BaseButton type="submit" :disabled="!form.amount || !form.categoryId" block>
          {{ budget ? 'Simpan' : 'Buat Budget' }}
        </BaseButton>
        <BaseButton type="button" variant="secondary" block @click="$emit('close')">
          Batal
        </BaseButton>
      </div>
    </form>
  </DetailDrawerLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { AlertCircle } from 'lucide-vue-next'
import { useCategoryStore } from '@/stores/category'
import { useBudgetStore, type BudgetWithUsage } from '@/stores/budget'
import DetailDrawerLayout from '@/components/layout/DetailDrawerLayout.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseAmountInput from '@/components/common/BaseAmountInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'

import { getDefaultAmount } from '@/utils/budgetHelper'

const props = defineProps<{
  isOpen: boolean
  budget: BudgetWithUsage | null
  month: string
  year: string
}>()

const emit = defineEmits<{ close: []; saved: [] }>()

const categoryStore = useCategoryStore()
const budgetStore = useBudgetStore()

const expenseCategories = computed(() =>
  categoryStore.categories.filter((c) => c.type === 'EXPENSE')
)

const months = [
  { value: '01', label: 'Jan' },
  { value: '02', label: 'Feb' },
  { value: '03', label: 'Mar' },
  { value: '04', label: 'Apr' },
  { value: '05', label: 'Mei' },
  { value: '06', label: 'Jun' },
  { value: '07', label: 'Jul' },
  { value: '08', label: 'Agu' },
  { value: '09', label: 'Sep' },
  { value: '10', label: 'Okt' },
  { value: '11', label: 'Nov' },
  { value: '12', label: 'Des' },
]

const errorMessage = ref('')
const form = ref({
  categoryId: '' as number | '',
  categoryName: '',
  amount: 0 as number,
  month: props.month,
  year: props.year,
})

watch(
  () => [props.isOpen, props.budget, props.month, props.year],
  () => {
    if (props.isOpen) {
      errorMessage.value = ''
      form.value.month = props.month
      form.value.year = props.year
      if (props.budget) {
        form.value.categoryId = props.budget.categoryId
        form.value.categoryName = props.budget.categoryName
        form.value.amount = props.budget.amount
      } else {
        form.value.categoryId = ''
        form.value.categoryName = ''
        form.value.amount = 0
      }
    }
  },
  { immediate: true }
)

watch(
  () => form.value.categoryId,
  (id) => {
    const c = categoryStore.categories.find((x) => x.id === id)
    form.value.categoryName = c?.name || ''
    
    // Prefill amount for new budget if current amount is 0
    if (!props.budget && form.value.amount === 0 && c) {
      form.value.amount = getDefaultAmount(c.name)
    }
  }
)

async function handleSave() {
  errorMessage.value = ''
  const payload = {
    categoryId: Number(form.value.categoryId),
    categoryName: form.value.categoryName,
    amount: Number(form.value.amount),
    month: form.value.month,
    year: form.value.year,
  }
  try {
    if (props.budget) {
      await budgetStore.updateBudget(props.budget.id, payload)
    } else {
      await budgetStore.createBudget(payload)
    }
    emit('saved')
  } catch (e: any) {
    errorMessage.value = e.response?.data?.message || 'Gagal menyimpan budget.'
  }
}

const currentYear = new Date().getFullYear()

const years = computed(() => {
  const list = []
  for (let y = currentYear - 2; y <= currentYear + 8; y++) {
    list.push(y)
  }
  return list
})

const yearOptions = computed(() => {
  return years.value.map(year => ({
    label: String(year),
    value: String(year)
  }))
})
</script>
