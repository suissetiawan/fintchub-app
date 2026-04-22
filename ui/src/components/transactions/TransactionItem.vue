<template>
  <div
    class="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800 transition-all"
    :class="{
      'hover:border-blue-100 dark:hover:border-blue-900/30 cursor-pointer active:scale-[0.98]':
        clickable,
    }"
    @click="clickable && $emit('click', transaction)"
  >
    <div class="flex items-center gap-3">
      <div
        :class="
          transaction.type === 'INCOME'
            ? 'bg-green-50 text-green-600 dark:bg-green-900/20'
            : 'bg-red-50 text-red-600 dark:bg-red-900/20'
        "
        class="p-2.5 rounded-xl transition-colors"
      >
        <component :is="transaction.type === 'INCOME' ? ArrowDownLeft : ArrowUpRight" :size="20" />
      </div>
      <div>
        <p
          :class="getTextFontSizeClass(transaction.description, 'font-medium')"
          class="text-gray-900 dark:text-white leading-tight transition-all"
        >
          {{ transaction.description }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {{ transaction.category }} • {{ formatDate(transaction.date) }}
        </p>
      </div>
    </div>
    <div class="text-right">
      <p
        :class="[
          getFontSizeClass(transaction.amount, 'text-base'),
          transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600',
        ]"
        class="font-bold transition-all"
      >
        {{ transaction.type === 'INCOME' ? '+' : '-' }} {{ formatNumber(transaction.amount) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowDownLeft, ArrowUpRight } from 'lucide-vue-next'
import { getFontSizeClass, getTextFontSizeClass } from '@/utils/amountHelper'
import type { Transaction } from '@/stores/transaction'

const props = withDefaults(
  defineProps<{
    transaction: Transaction
    clickable?: boolean
  }>(),
  {
    clickable: true,
  },
)

defineEmits(['click'])

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('id-ID').format(num)
}

const formatDate = (dateStr: string) => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: '2-digit' }
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', options)
  } catch (e) {
    return dateStr
  }
}
</script>
