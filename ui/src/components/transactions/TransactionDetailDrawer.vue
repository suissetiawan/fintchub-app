<template>
  <DetailDrawerLayout
    :is-open="isOpen"
    :title="isNew ? 'New Transaction' : isEditing ? 'Edit Transaction' : 'Transaction Details'"
    @close="close"
    height-class="h-auto max-h-[90vh]"
  >
    <div v-if="detailLoading" class="space-y-8 animate-pulse">
      <!-- Skeleton View Mode -->
      <div class="flex flex-col items-center py-4">
        <div class="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-3xl mb-4"></div>
        <div class="w-48 h-10 bg-gray-200 dark:bg-gray-800 rounded-xl mb-4"></div>
        <div class="w-32 h-6 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
          <div class="w-12 h-3 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
          <div class="w-24 h-5 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
          <div class="w-12 h-3 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
          <div class="w-24 h-5 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
      </div>

      <div class="flex flex-col gap-3 pt-4">
        <div class="w-full h-14 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        <div class="w-full h-14 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
      </div>
    </div>

    <div v-else-if="!isNew && !isEditing" class="space-y-8">
      <!-- View Mode -->
      <div v-if="detailTransaction" class="flex flex-col items-center py-4">
        <div
          :class="
            detailTransaction.type === 'INCOME'
              ? 'bg-green-100 text-green-600 dark:bg-green-900/30'
              : 'bg-red-100 text-red-600 dark:bg-red-900/30'
          "
          class="p-4 rounded-3xl mb-4"
        >
          <component
            :is="detailTransaction.type === 'INCOME' ? ArrowDownLeft : ArrowUpRight"
            :size="40"
          />
        </div>
        <h3
          :class="getFontSizeClass(detailTransaction.amount, 'text-3xl')"
          class="font-black text-gray-900 dark:text-white transition-all"
        >
          {{ detailTransaction.type === 'INCOME' ? '+' : '-' }} Rp
          {{ formatNumber(detailTransaction.amount) }}
        </h3>
        <p
          :class="getTextFontSizeClass(detailTransaction.description, 'font-medium')"
          class="text-gray-500 dark:text-gray-400 mt-1 transition-all text-center"
        >
          {{ detailTransaction.description }}
        </p>
      </div>

      <div v-if="detailTransaction" class="grid grid-cols-2 gap-4">
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Category</p>
          <p class="font-bold text-gray-900 dark:text-white">
            {{ detailTransaction.category }}
          </p>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Date</p>
          <p class="font-bold text-gray-900 dark:text-white">
            {{ formatDate(detailTransaction.date) }}
          </p>
        </div>
      </div>

      <div class="flex flex-col gap-3 pt-3">
        <BaseButton @click="isEditing = true" block>
          <Edit2 :size="20" />
          Edit Transaction
        </BaseButton>
        <BaseButton @click="confirmDelete" variant="danger" block>
          <Trash2 :size="20" />
          Delete
        </BaseButton>
      </div>
    </div>

    <form v-else @submit.prevent="handleSave" class="space-y-6">
      <!-- Type Toggle -->
      <div class="flex p-1 bg-gray-100 dark:bg-gray-900 rounded-2xl">
        <button
          type="button"
          @click="form.type = 'EXPENSE'"
          :class="
            form.type === 'EXPENSE'
              ? 'bg-white dark:bg-gray-800 shadow-sm text-red-600'
              : 'text-gray-500'
          "
          class="flex-1 py-2.5 font-bold rounded-xl transition-all active:scale-95"
        >
          Expense
        </button>
        <button
          type="button"
          @click="form.type = 'INCOME'"
          :class="
            form.type === 'INCOME'
              ? 'bg-white dark:bg-gray-800 shadow-sm text-green-600'
              : 'text-gray-500'
          "
          class="flex-1 py-2.5 font-bold rounded-xl transition-all active:scale-95"
        >
          Income
        </button>
      </div>

      <div class="space-y-4">
        <!-- Amount -->
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"
            >Amount (Rp)</label
          >
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">Rp</span>
            <input
              :value="formattedAmount"
              @input="onAmountInput"
              inputmode="numeric"
              required
              class="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none dark:text-white text-xl font-black"
              placeholder="0"
            />
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"
            >Description</label
          >
          <input
            v-model="form.description"
            type="text"
            class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none dark:text-white"
            placeholder="e.g. Lunch at Warteg"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <!-- Category Selection -->
          <div class="relative group">
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"
              >Category</label
            >
            <select
              v-model="form.category"
              class="appearance-none w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none dark:text-white cursor-pointer"
            >
              <option v-for="cat in filteredCategories" :key="cat.id" :value="cat.name">
                {{ cat.name }}
              </option>
            </select>
            <ChevronDown
              class="absolute right-3 top-[3.2rem] -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors"
              :size="18"
            />
          </div>

          <!-- Date Selection -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"
              >Date</label
            >
            <input
              v-model="form.date"
              type="date"
              class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none dark:text-white"
            />
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-3 pt-3">
        <BaseButton type="submit" :disabled="loading || !isValid" :loading="loading" block>
          <Plus v-if="isNew" :size="24" />
          {{ isNew ? 'Save Transaction' : 'Update Transaction' }}
        </BaseButton>
        <BaseButton type="button" @click="cancelEdit" variant="secondary" block>
          Cancel
        </BaseButton>
      </div>
    </form>
  </DetailDrawerLayout>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { ArrowDownLeft, ArrowUpRight, Edit2, Trash2, ChevronDown, Plus } from 'lucide-vue-next'
import { useTransactionStore, type Transaction } from '@/stores/transaction'
import { useCategoryStore } from '@/stores/category'
import { getFontSizeClass, getTextFontSizeClass } from '@/utils/amountHelper'
import DetailDrawerLayout from '@/components/layout/DetailDrawerLayout.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const props = defineProps<{
  isOpen: boolean
  transaction: Transaction | null
}>()

const emit = defineEmits(['close', 'success'])
const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()

const isNew = computed(() => !props.transaction)
const isEditing = ref(false)
const loading = ref(false)
const detailLoading = ref(false)
const detailTransaction = ref<Transaction | null>(null)

const getToday = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const form = ref({
  amount: 0,
  description: '',
  type: 'EXPENSE',
  category: '',
  date: getToday(),
})

const getFormattedDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

watch(
  () => props.isOpen,
  async (newVal) => {
    if (newVal) {
      if (props.transaction) {
        // Existing Transaction Logic
        isEditing.value = false
        detailLoading.value = true
        try {
          const data = await transactionStore.getTransactionById(props.transaction.id)
          detailTransaction.value = data
          // Prep for edit mode
          form.value = {
            ...data,
            date: getFormattedDate(data.date),
          }
        } catch (error) {
          console.error('Failed to fetch transaction details:', error)
          detailTransaction.value = props.transaction // Fallback to prop data
        } finally {
          detailLoading.value = false
        }
      } else {
        // New Transaction Logic
        isEditing.value = true
        detailTransaction.value = null
        detailLoading.value = false

        const type = 'EXPENSE'
        const cats = categoryStore.categories.filter((c) => c.type === type)

        form.value = {
          amount: 0,
          description: '',
          type,
          category: cats.length > 0 ? cats[0].name : '',
          date: getToday(),
        }
      }

      if (categoryStore.categories.length === 0) {
        categoryStore.fetchCategories()
      }
    }
  },
  { immediate: true },
)

const filteredCategories = computed(() => {
  return categoryStore.categories.filter((c) => c.type === form.value.type)
})

watch(filteredCategories, (newCats) => {
  if (newCats.length > 0) {
    const isCurrentValid = newCats.some((c) => c.name === form.value.category)
    if (!isCurrentValid) {
      form.value.category = newCats[0].name
    }
  }
})

const formattedAmount = computed(() => {
  return formatNumber(form.value.amount)
})

const isValid = computed(() => {
  return form.value.amount > 0 && form.value.description && form.value.category && form.value.date
})

const formatNumber = (num: number) => {
  if (!num) return ''
  return new Intl.NumberFormat('id-ID').format(num)
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const close = () => {
  emit('close')
}

const cancelEdit = () => {
  if (isNew.value) {
    close()
  } else {
    isEditing.value = false
  }
}

const handleSave = async () => {
  loading.value = true
  try {
    if (isNew.value) {
      await transactionStore.createTransaction(form.value)
    } else if (props.transaction?.id) {
      await transactionStore.updateTransaction(props.transaction.id, form.value)
    }
    emit('success')
    close()
  } catch (error) {
    console.error('Update failed:', error)
  } finally {
    loading.value = false
  }
}

// handler input
function onAmountInput(e: Event) {
  const target = e.target as HTMLInputElement
  const raw = target.value.replace(/\D/g, '') // ambil angka saja
  form.value.amount = raw ? Number(raw) : 0
}

const confirmDelete = async () => {
  if (props.transaction && confirm('Are you sure you want to delete this transaction?')) {
    try {
      await transactionStore.deleteTransaction(props.transaction.id)
      close()
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }
}
onMounted(() => {
  if (categoryStore.categories.length === 0) {
    categoryStore.fetchCategories()
  }
})
</script>
