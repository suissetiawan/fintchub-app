<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <button
        @click="$router.back()"
        class="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 shadow-sm transition-all active:scale-95 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <ChevronLeft :size="20" />
      </button>
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
          <button 
            @click="addTemplate"
            class="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-xl font-bold text-sm hover:bg-blue-100 transition-all active:scale-95 order-1 sm:order-2"
          >
            <Plus :size="18" /> Tambah Item
          </button>
        </div>

        <div class="space-y-4">
          <div v-for="(item, index) in localTemplates" :key="item._uId" class="group relative p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all hover:border-blue-200 dark:hover:border-blue-900/30">
            <div class="flex flex-col sm:flex-row gap-4 sm:items-end">
              <!-- Category Selector -->
              <div class="flex-1 space-y-1.5">
                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Kategori</label>
                <div class="relative group/select">
                  <select 
                    v-model="item.categoryId"
                    class="appearance-none w-full px-4 py-2.5 bg-white dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-bold text-gray-900 dark:text-white cursor-pointer transition-all shadow-sm"
                  >
                    <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">
                      {{ cat.name }}
                    </option>
                  </select>
                  <ChevronDown
                    class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover/select:text-blue-500 transition-colors"
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
          <button 
            @click="saveTemplates"
            class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
            :disabled="loading"
          >
            {{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
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
  
  // If empty, auto-populate with all categories
  if (localTemplates.value.length === 0) {
    localTemplates.value = categoryStore.categories.map(cat => ({
      categoryId: cat.id,
      amount: 0,
      _uId: generateId()
    }))
  }
})

function addTemplate() {
  localTemplates.value.push({
    categoryId: categoryStore.categories[0]?.id || 0,
    amount: 0,
    _uId: generateId()
  })
}

function removeTemplate(index: number) {
  localTemplates.value.splice(index, 1)
}

async function saveTemplates() {
  loading.value = true
  try {
    // Only save templates with amount > 0
    const toSave = localTemplates.value.filter(t => t.amount && t.amount > 0)
    await budgetStore.updateTemplates(toSave)
    router.back()
  } catch (error) {
    console.error('Save templates failed:', error)
  } finally {
    loading.value = false
  }
}
</script>
