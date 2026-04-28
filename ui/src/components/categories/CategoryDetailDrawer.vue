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
    <!-- Error Message Banner -->
    <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-900/30 text-sm font-medium flex items-start gap-3">
      <AlertCircle :size="18" class="shrink-0 mt-0.5" />
      <p>{{ errorMessage }}</p>
    </div>

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

        <!-- Admin Only: View Ownership -->
        <div v-if="authStore.isAdmin" class="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl">
          <p
            class="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-2"
          >
            Ownership
          </p>
          <div class="flex items-center gap-2">
            <div 
              :class="[
                'w-2 h-2 rounded-full',
                category.userId === null ? 'bg-blue-500' : 'bg-purple-500'
              ]"
            ></div>
            <p class="text-lg font-black text-gray-900 dark:text-white">
              {{ category.userId === null ? 'Global' : `Personal: ${category.user?.name || 'User'}` }}
            </p>
          </div>
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
            class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-brand-600 outline-none dark:text-white"
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

        <!-- Admin Only: Ownership Edit -->
        <div v-if="authStore.isAdmin" class="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <p class="text-sm font-bold text-gray-700 dark:text-gray-300">Ownership Settings (Admin Only)</p>
          
          <div class="flex p-1 bg-gray-100 dark:bg-gray-900 rounded-2xl">
            <button
              type="button"
              @click="form.userId = null"
              :class="
                form.userId === null
                  ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600'
                  : 'text-gray-500'
              "
              class="flex-1 py-2.5 font-bold rounded-xl transition-all text-sm"
            >
              Global
            </button>
            <button
              type="button"
              @click="form.userId = category?.userId || authStore.user?.id || 0"
              :class="
                form.userId !== null
                  ? 'bg-white dark:bg-gray-800 shadow-sm text-purple-600'
                  : 'text-gray-500'
              "
              class="flex-1 py-2.5 font-bold rounded-xl transition-all text-sm"
            >
              Personal
            </button>
          </div>

          <div v-if="form.userId !== null">
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase">Assign to User</label>
            <BaseSelect 
              v-model="form.userId"
              :options="userStore.users.map(u => ({ label: `${u.name} (${u.username})`, value: u.id }))"
              placeholder="Select User"
              size="sm"
            />
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

    <!-- Delete Confirmation -->
    <BaseConfirmDialog
      :is-open="isDeleteDialogOpen"
      title="Hapus Kategori?"
      confirm-text="Hapus"
      variant="danger"
      icon="trash"
      @confirm="executeDelete"
      @cancel="isDeleteDialogOpen = false"
    >
      Anda akan menghapus kategori <span class="font-bold text-gray-900 dark:text-white">"{{ category?.name }}"</span>.<br>
      <span class="text-xs text-red-500 mt-2 block">Perhatian: Kategori tidak dapat dihapus jika masih terikat dengan riwayat transaksi atau budget.</span>
    </BaseConfirmDialog>
  </DetailDrawerLayout>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Edit2, Trash2, AlertCircle } from 'lucide-vue-next'
import { useCategoryStore, type Category } from '@/stores/category'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import DetailDrawerLayout from '@/components/layout/DetailDrawerLayout.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseConfirmDialog from '@/components/common/BaseConfirmDialog.vue'

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
const authStore = useAuthStore()
const userStore = useUserStore()

const isEditing = ref(false)
const isNew = computed(() => !props.category?.id)
const isDeleteDialogOpen = ref(false)
const errorMessage = ref('')
const form = ref({
  name: '',
  type: 'EXPENSE' as 'INCOME' | 'EXPENSE',
  userId: null as number | string | null,
})

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      errorMessage.value = ''
      if (props.category) {
        form.value = {
          name: props.category.name,
          type: props.category.type || 'EXPENSE',
          userId: props.category.userId,
        }
        isEditing.value = false
      } else {
        form.value = { 
          name: '', 
          type: 'EXPENSE',
          userId: authStore.isAdmin ? null : authStore.user?.id || null 
        }
        isEditing.value = true
      }
      
      // Fetch users if admin for selection
      if (authStore.isAdmin && userStore.users.length === 0) {
        userStore.fetchUsers()
      }
    } else {
      isDeleteDialogOpen.value = false
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
  errorMessage.value = ''
  try {
    if (isNew.value) {
      await categoryStore.createCategory(form.value)
    } else if (props.category?.id) {
      await categoryStore.updateCategory(props.category.id, form.value)
    }
    close()
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Gagal menyimpan kategori.'
    console.error('Save category failed:', error)
  }
}

const confirmDelete = () => {
  if (!props.category?.id) return
  isDeleteDialogOpen.value = true
}

const executeDelete = async () => {
  if (!props.category?.id) return
  errorMessage.value = ''

  try {
    await categoryStore.deleteCategory(props.category.id)
    isDeleteDialogOpen.value = false
    close()
  } catch (error: any) {
    isDeleteDialogOpen.value = false
    errorMessage.value = error.response?.data?.message || 'Gagal menghapus kategori.'
    console.error('Delete category failed:', error)
  }
}
</script>
