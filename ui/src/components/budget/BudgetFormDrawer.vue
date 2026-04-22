<template>
  <DetailDrawerLayout
    :is-open="isOpen"
    :title="budget ? 'Edit Budget' : 'Tambah Budget'"
    @close="$emit('close')"
    height-class="h-auto max-h-[90vh]"
  >
    <form @submit.prevent="handleSave" class="space-y-6">
      <div>
        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Kategori</label>
        <select
          v-model="form.categoryId"
          required
          :disabled="!!budget"
          class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none dark:text-white disabled:opacity-60"
        >
          <option value="">Pilih kategori</option>
          <option
            v-for="c in expenseCategories"
            :key="c.id"
            :value="c.id"
          >
            {{ c.name }}
          </option>
        </select>
        <p v-if="budget" class="mt-1 text-xs text-gray-500 dark:text-gray-400">Kategori tidak dapat diubah</p>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Limit Budget (Rp)</label>
        <input
          v-model.number="form.amount"
          type="number"
          min="1"
          required
          class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none dark:text-white"
          placeholder="Contoh: 2000000"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Bulan</label>
          <select
            v-model="form.month"
            required
            class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none dark:text-white"
          >
            <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tahun</label>
          <input
            v-model="form.year"
            type="number"
            min="2020"
            max="2030"
            required
            class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none dark:text-white"
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
import { useCategoryStore } from '@/stores/category'
import { useBudgetStore, type BudgetWithUsage } from '@/stores/budget'
import DetailDrawerLayout from '@/components/layout/DetailDrawerLayout.vue'
import BaseButton from '@/components/common/BaseButton.vue'

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
  }
)

async function handleSave() {
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
  } catch (e) {
    console.error(e)
  }
}
</script>
