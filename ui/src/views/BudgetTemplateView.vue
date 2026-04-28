<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <BaseButton
        @click="$router.back()"
        variant="secondary"
        class="!p-2.5"
      >
        <ChevronLeft :size="20" />
      </BaseButton>
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Budget Template</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Atur budget standar untuk auto-generate</p>
      </div>
    </div>

    <div class="p-5 bg-white rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p class="text-sm text-gray-500 dark:text-gray-400 max-w-md order-2 sm:order-1">
            Item di bawah ini akan otomatis dibuat setiap bulan saat Anda menggunakan fitur Auto Generate.
          </p>
          <BaseButton 
            @click="addTemplate"
            variant="secondary"
            size="sm"
            class="order-1 sm:order-2"
          >
            <template #icon-left><Plus :size="18" /></template>
            Tambah Item
          </BaseButton>
        </div>

        <div class="space-y-4">
          <div v-for="(item, index) in localTemplates" :key="item._uId" class="group relative p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all hover:border-brand-200 dark:hover:border-brand-900/30">
            <div class="flex flex-col sm:flex-row gap-4 sm:items-end">
              <!-- Category Selector -->
              <div class="flex-1 space-y-1.5">
                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Kategori</label>
                <div class="relative group/select">
                  <select 
                    v-model="item.categoryId"
                    class="appearance-none w-full px-4 py-2.5 bg-white dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-brand-600 outline-none text-sm font-bold text-gray-900 dark:text-white cursor-pointer transition-all shadow-sm"
                  >
                    <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">
                      {{ cat.name }}
                    </option>
                  </select>
                  <ChevronDown
                    class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover/select:text-brand-500 transition-colors"
                    :size="18"
                  />
                </div>
              </div>

              <!-- Amount Input -->
              <div class="w-full sm:w-64 space-y-1.5">
                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Nominal Bulanan</label>
                <BaseAmountInput 
                  v-model="item.amount"
                  size="base"
                  placeholder="0"
                />
              </div>

              <!-- Delete Button (Desktop) -->
              <div class="hidden sm:block pb-1">
                <button 
                  @click="removeTemplate(index)" 
                  class="p-3 bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-xl transition-colors"
                  title="Hapus"
                >
                  <X :size="20" />
                </button>
              </div>
            </div>

            <!-- Delete Button (Mobile) -->
            <button 
              @click="removeTemplate(index)" 
              class="sm:hidden absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400 rounded-full shadow-md active:scale-95 transition-all"
            >
              <X :size="14" />
            </button>
          </div>
        </div>

        <div v-if="localTemplates.length === 0" class="py-10 text-center bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
           <p class="text-gray-500 dark:text-gray-400 text-sm">Belum ada template. Klik "Tambah Item" untuk memulai.</p>
        </div>

        <div class="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
          <BaseButton 
            @click="saveTemplates"
            class="px-8"
            :loading="loading"
          >
            Simpan Perubahan
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ChevronLeft, Plus, X, ChevronDown } from 'lucide-vue-next'
import { useBudgetStore, type BudgetTemplate } from '@/stores/budget'
import { useCategoryStore } from '@/stores/category'
import { useRouter } from 'vue-router'
import BaseAmountInput from '@/components/common/BaseAmountInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { getDefaultAmount } from '@/utils/budgetHelper'

const budgetStore = useBudgetStore()
const categoryStore = useCategoryStore()
const router = useRouter()

type LocalTemplate = Partial<BudgetTemplate> & { _uId: string }
const localTemplates = ref<LocalTemplate[]>([])
const loading = ref(false)

const generateId = () => Math.random().toString(36).substring(2, 9)

onMounted(async () => {
  await categoryStore.fetchCategories()
  await budgetStore.fetchTemplates()
  
  // Clone templates from store and add unique IDs
  localTemplates.value = budgetStore.templates.map(t => ({ 
    ...t, 
    _uId: generateId() 
  }))
  
  // If empty, auto-populate with all categories and prefill common amounts
  if (localTemplates.value.length === 0) {
    localTemplates.value = categoryStore.categories
      .filter(cat => cat.type === 'EXPENSE')
      .map(cat => ({
        categoryId: cat.id,
        amount: getDefaultAmount(cat.name),
        _uId: generateId()
      }))
  }
})

function addTemplate() {
  const cat = categoryStore.categories.find(c => c.type === 'EXPENSE') || categoryStore.categories[0]
  localTemplates.value.push({
    categoryId: cat?.id || 0,
    amount: cat ? getDefaultAmount(cat.name) : 0,
    _uId: generateId()
  })
}

function removeTemplate(index: number) {
  localTemplates.value.splice(index, 1)
}

async function saveTemplates() {
  loading.value = true
  try {
    // Only save templates with amount > 0, ensuring they are numbers
    const toSave = localTemplates.value
      .filter(t => t.amount && Number(t.amount) > 0)
      .map(t => ({ ...t, amount: Number(t.amount) }))
    await budgetStore.updateTemplates(toSave)
    router.back()
  } catch (error) {
    console.error('Save templates failed:', error)
  } finally {
    loading.value = false
  }
}
</script>
