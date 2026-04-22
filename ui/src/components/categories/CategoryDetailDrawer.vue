<template>
  <DetailDrawerLayout
    :is-open="isOpen"
    :title="
      !category
        ? 'New Category'
        : isEditing
          ? 'Edit Category'
          : 'Category Details'
    "
    @close="close"
    height-class="h-auto max-h-[90vh]"
  >
    <div v-if="!isEditing && category" class="space-y-8">
      <!-- View Mode -->
      <div class="space-y-6">
        <div class="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl">
          <p
            class="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-2"
          >
            Category Name
          </p>
          <p class="text-xl font-black text-gray-900 dark:text-white">{{ category.name }}</p>
        </div>

        <div class="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl">
          <p
            class="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-2"
          >
            Type
          </p>
          <p
            :class="category.type === 'INCOME' ? 'text-green-600' : 'text-red-600'"
            class="text-lg font-black"
          >
            {{ category.type }}
          </p>
        </div>
      </div>

      <div v-if="canEdit" class="flex flex-col gap-3 pt-3">
        <BaseButton @click="isEditing = true" block>
          <Edit2 :size="20" />
          Edit Category
        </BaseButton>
        <BaseButton @click="confirmDelete" variant="danger" block>
          <Trash2 :size="20" />
          Delete Category
        </BaseButton>
      </div>
    </div>

    <div v-else-if="canEdit" class="space-y-6">
      <!-- Edit Mode -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"
            >Category Name</label
          >
          <input
            v-model="form.name"
            type="text"
            class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none dark:text-white"
            placeholder="e.g. Entertainment"
          />
        </div>

        <!-- Type Selection -->
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Type</label>
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
        </div>
      </div>

      <div class="flex flex-col gap-3 pt-3">
        <BaseButton @click="handleSave" :disabled="!form.name" block>
          {{ isNew ? 'Create Category' : 'Update Category' }}
        </BaseButton>
        <BaseButton @click="cancelEdit" variant="secondary" block> Cancel </BaseButton>
      </div>
    </div>

    <div v-else class="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
      Select a category to view details.
    </div>
  </DetailDrawerLayout>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Edit2, Trash2 } from 'lucide-vue-next'
import { useCategoryStore, type Category } from '@/stores/category'
import DetailDrawerLayout from '@/components/layout/DetailDrawerLayout.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    category: Category | null
    canEdit?: boolean
  }>(),
  { canEdit: true }
)

const emit = defineEmits(['close'])
const categoryStore = useCategoryStore()

const isEditing = ref(false)
const isNew = computed(() => !props.category?.id)
const form = ref({
  name: '',
  type: 'EXPENSE' as 'INCOME' | 'EXPENSE',
})

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      if (props.category) {
        form.value = {
          name: props.category.name,
          type: props.category.type || 'EXPENSE',
        }
        isEditing.value = false
      } else {
        form.value = { name: '', type: 'EXPENSE' }
        isEditing.value = true
      }
    }
  },
)

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
  try {
    if (isNew.value) {
      await categoryStore.createCategory(form.value)
    } else if (props.category?.id) {
      await categoryStore.updateCategory(props.category.id, form.value)
    }
    close()
  } catch (error) {
    console.error('Save category failed:', error)
  }
}

const confirmDelete = async () => {
  if (!props.category?.id) return

  if (
    confirm(
      `Are you sure you want to delete "${props.category.name}"? This may affect transactions using this category.`,
    )
  ) {
    try {
      await categoryStore.deleteCategory(props.category.id)
      close()
    } catch (error) {
      console.error('Delete category failed:', error)
    }
  }
}
</script>
