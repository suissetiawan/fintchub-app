<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
      <BaseButton
        @click="openAddDrawer"
        class="!p-2.5"
      >
        <Plus :size="20" />
      </BaseButton>
    </div>

    <!-- Filter by type: All | Income | Expense -->
    <div class="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
      <button
        v-for="tab in typeTabs"
        :key="tab.value"
        type="button"
        @click="filterType = tab.value"
        :class="[
          'flex-1 py-2.5 px-4 font-bold rounded-xl transition-all active:scale-95 text-sm',
          filterType === tab.value
            ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Category List -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-if="categoryStore.loading && categoryStore.categories.length === 0"
        class="col-span-full py-20 flex flex-col items-center"
      >
        <div
          class="h-10 w-10 border-4 border-gray-200 border-t-brand-600 rounded-full animate-spin dark:border-gray-800"
        ></div>
        <p class="mt-4 text-gray-500 dark:text-gray-400">Loading categories...</p>
      </div>

      <template v-else-if="filteredCategories.length > 0">
        <div
          v-for="cat in filteredCategories"
          :key="cat.id"
          @click="openDetails(cat)"
          class="group px-4 py-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 hover:border-brand-100 dark:hover:border-brand-900/30 cursor-pointer active:scale-95"
        >
          <div class="flex items-start justify-between">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <h3
                  class="text-lg font-black text-gray-900 dark:text-white group-hover:text-brand-600 transition-colors"
                >
                  {{ cat.name }}
                </h3>
                <span
                  :class="
                    cat.type === 'INCOME'
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30'
                      : 'bg-red-100 text-red-600 dark:bg-red-900/30'
                  "
                  class="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                >
                  {{ cat.type }}
                </span>
              </div>
            </div>
            <div
              class="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20 group-hover:text-brand-600 transition-colors"
            >
              <ChevronRight :size="18" />
            </div>
          </div>
        </div>
      </template>

      <!-- Empty State (filtered or no categories) -->
      <div
        v-else
        class="col-span-full py-20 flex flex-col items-center bg-white dark:bg-gray-900 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-800"
      >
        <div class="p-5 bg-gray-50 dark:bg-gray-800 rounded-full mb-4">
          <Tags :size="40" class="text-gray-400" />
        </div>
        <h3 class="font-bold text-gray-900 dark:text-white">
          {{ filterType ? 'No categories in this type' : 'No categories yet' }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {{ filterType ? 'Try another filter' : 'Start by adding your first category' }}
        </p>
        <BaseButton
          v-if="!filterType"
          @click="openAddDrawer"
          class="mt-6 px-6"
        >
          Add Category
        </BaseButton>
      </div>
    </div>

    <!-- Category Detail Drawer -->
    <CategoryDetailDrawer
      :is-open="isDrawerOpen"
      :category="selectedCategory"
      :can-edit="authStore.isAdmin || !selectedCategory || (selectedCategory.userId === authStore.user?.id)"
      @close="closeDrawer"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, ChevronRight, Tags } from 'lucide-vue-next'
import { useCategoryStore, type Category } from '@/stores/category'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/common/BaseButton.vue'
import CategoryDetailDrawer from '@/components/categories/CategoryDetailDrawer.vue'

const categoryStore = useCategoryStore()
const authStore = useAuthStore()

const typeTabs = [
  { label: 'All', value: '' },
  { label: 'Income', value: 'INCOME' },
  { label: 'Expense', value: 'EXPENSE' },
] as const

const filterType = ref<'INCOME' | 'EXPENSE' | ''>('')
const filteredCategories = computed(() => {
  const list = categoryStore.categories
  if (!filterType.value) return list
  return list.filter((c) => c.type === filterType.value)
})

const isDrawerOpen = ref(false)
const selectedCategory = ref<Category | null>(null)

const openAddDrawer = () => {
  selectedCategory.value = null
  isDrawerOpen.value = true
}

const openDetails = (cat: Category) => {
  selectedCategory.value = cat
  isDrawerOpen.value = true
}

const closeDrawer = () => {
  isDrawerOpen.value = false
}

onMounted(() => {
  categoryStore.fetchCategories()
})
</script>
