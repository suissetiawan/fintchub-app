<template>
  <DetailDrawerLayout
    :is-open="isOpen"
    :title="isEditing ? (isNew ? 'Create User' : 'Edit User') : 'User Details'"
    @close="close"
    height-class="h-auto max-h-[90vh]"
  >
    <div v-if="!isEditing && user" class="space-y-8">
      <!-- View Mode -->
      <div class="flex flex-col items-center py-4">
        <div
          class="w-20 h-20 rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 flex items-center justify-center mb-4 font-black text-2xl"
        >
          {{ getInitials(user.name || user.username) }}
        </div>
        <h3 class="text-2xl font-black text-gray-900 dark:text-white">{{ user.name || user.username }}</h3>
        <p class="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">@{{ user.username }}</p>
        <p class="text-gray-500 dark:text-gray-400 font-medium mt-1">{{ user.email }}</p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Role</p>
          <div
            class="inline-flex items-center px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/20 text-xs font-bold"
          >
            {{ user.role }}
          </div>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">User ID</p>
          <p class="font-bold text-gray-900 dark:text-white">#{{ user.id }}</p>
        </div>
      </div>

      <div class="flex flex-col gap-3 pt-3">
        <BaseButton @click="isEditing = true" block>
          <Edit2 :size="20" />
          Edit User
        </BaseButton>
        <BaseButton @click="confirmDelete" variant="danger" block>
          <Trash2 :size="20" />
          Delete User
        </BaseButton>
      </div>
    </div>

    <div v-else class="space-y-6">
      <!-- Edit Mode -->
      <div class="space-y-5">
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"
            >Username</label
          >
          <input
            v-model="form.username"
            type="text"
            autocomplete="off"
            class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-brand-600 outline-none dark:text-white"
            placeholder="Ex: bambang"
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"
            >Full Name</label
          >
          <input
            v-model="form.name"
            type="text"
            class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-brand-600 outline-none dark:text-white"
            placeholder="Ex: Bambang Sugiono"
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"
            >Email Address</label
          >
          <input
            v-model="form.email"
            type="email"
            autocomplete="off"
            class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-brand-600 outline-none dark:text-white"
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Password {{ isNew ? '' : '(Opsional)' }}
          </label>
          <input
            v-model="form.password"
            type="password"
            autocomplete="new-password"
            class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-brand-600 outline-none dark:text-white"
            :placeholder="isNew ? 'Masukkan password' : 'Kosongkan jika tidak ingin diubah'"
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"
            >User Role</label
          >
          <div class="flex gap-4">
            <button
              type="button"
              @click="form.role = 'USER'"
              :class="
                form.role === 'USER'
                  ? 'ring-2 ring-brand-600 bg-brand-50 text-brand-600 dark:bg-brand-900/20'
                  : 'bg-gray-50 dark:bg-gray-900 text-gray-500'
              "
              class="flex-1 py-2.5 font-bold rounded-xl transition-all"
            >
              USER
            </button>
            <button
              type="button"
              @click="form.role = 'ADMIN'"
              :class="
                form.role === 'ADMIN'
                  ? 'ring-2 ring-brand-600 bg-brand-50 text-brand-600 dark:bg-brand-900/20'
                  : 'bg-gray-50 dark:bg-gray-900 text-gray-500'
              "
              class="flex-1 py-2.5 font-bold rounded-xl transition-all"
            >
              ADMIN
            </button>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-3 pt-3">
        <BaseButton @click="handleSave" :disabled="!isValid" block>
          {{ isNew ? 'Create User' : 'Update User' }}
        </BaseButton>
        <BaseButton @click="cancelEdit" variant="secondary" block> Cancel </BaseButton>
      </div>
    </div>
  </DetailDrawerLayout>

  <BaseConfirmDialog
    :is-open="showDeleteConfirm"
    title="Delete User"
    :message="`Are you sure you want to delete user '${user?.username}'? This action cannot be undone.`"
    variant="danger"
    icon="trash"
    confirm-text="Delete User"
    @confirm="handleDelete"
    @cancel="showDeleteConfirm = false"
  />
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Edit2, Trash2 } from 'lucide-vue-next'
import { useUserStore, type User } from '@/stores/user'
import DetailDrawerLayout from '@/components/layout/DetailDrawerLayout.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseConfirmDialog from '@/components/common/BaseConfirmDialog.vue'
import BaseSkeleton from '@/components/common/BaseSkeleton.vue'
import { getInitials } from '@/utils/stringHelper'

const props = defineProps<{
  isOpen: boolean
  user: User | null
}>()

const emit = defineEmits(['close'])
const userStore = useUserStore()

const isEditing = ref(false)
const showDeleteConfirm = ref(false)
const isNew = computed(() => !props.user?.id)
const form = ref({
  username: '',
  name: '',
  email: '',
  password: '',
  role: 'USER' as 'USER' | 'ADMIN',
})

const isValid = computed(() => {
  if (isNew.value) {
    return form.value.username && form.value.name && form.value.email && form.value.password
  }
  return form.value.username && form.value.name && form.value.email
})

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      if (props.user) {
        form.value = {
          username: props.user.username,
          name: props.user.name || props.user.username,
          email: props.user.email,
          password: '',
          role: props.user.role,
        }
        isEditing.value = false
      } else {
        form.value = { username: '', name: '', email: '', password: '', role: 'USER' }
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
      await userStore.createUser(form.value)
    } else if (props.user?.id) {
      const payload: any = {
        username: form.value.username,
        name: form.value.name,
        email: form.value.email,
        role: form.value.role,
      }
      if (form.value.password) {
        payload.password = form.value.password
      }
      await userStore.updateUser(props.user.id, payload)
    }
    close()
  } catch (error) {
    console.error('Save user failed:', error)
  }
}

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!props.user?.id) return

  try {
    await userStore.deleteUser(props.user.id)
    showDeleteConfirm.value = false
    close()
  } catch (error) {
    console.error('Delete user failed:', error)
  }
}
</script>
