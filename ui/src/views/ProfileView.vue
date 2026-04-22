<template>
  <div class="space-y-4 sm:space-y-6 max-w-2xl mx-auto">
    <!-- Profile Header -->
    <div class="text-center space-y-3 sm:space-y-4">
      <div
        class="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
      >
        <UserIcon :size="40" />
      </div>
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
          {{ authStore.displayName }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ authStore.user?.email }}</p>
      </div>
    </div>

    <!-- Profile Details Card -->
    <div
      class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-8 shadow-sm space-y-6 sm:space-y-8"
    >
      <div class="grid gap-4 sm:gap-6 sm:grid-cols-2">
        <div class="space-y-1">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Username</p>
          <p class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            {{ authStore.user?.username }}
          </p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Account Role</p>
          <div
            class="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 text-sm font-bold"
          >
            {{ authStore.user?.role }}
          </div>
        </div>
        <div class="space-y-1 col-span-full">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">User ID</p>
          <p class="text-base sm:text-lg font-mono text-gray-600 dark:text-gray-400">
            #{{ authStore.user?.id }}
          </p>
        </div>
      </div>

      <div class="pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3">
        <button
          @click="openEditDrawer"
          class="w-full py-3 sm:py-4 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 font-black rounded-xl sm:rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <Edit2 :size="18" /> Edit Profile
        </button>
        <button
          @click="handleLogout"
          class="w-full py-3 sm:py-4 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/10 dark:hover:bg-red-900/20 font-black rounded-xl sm:rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <LogOut :size="18" /> Sign Out
        </button>
      </div>
    </div>

    <!-- Edit Profile Drawer -->
    <DetailDrawerLayout
      :is-open="isEditDrawerOpen"
      title="Edit Profile"
      @close="closeEditDrawer"
      height-class="h-auto max-h-[90vh]"
    >
      <div class="space-y-5">
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Username</label>
          <input
            v-model="editForm.username"
            type="text"
            class="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none dark:text-white text-sm"
            placeholder="Your username"
          />
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
          <input
            v-model="editForm.name"
            type="text"
            class="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none dark:text-white text-sm"
            placeholder="Your display name"
          />
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
          <input
            v-model="editForm.email"
            type="email"
            class="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none dark:text-white text-sm"
            placeholder="your@email.com"
          />
        </div>
        <div class="flex flex-col gap-3 pt-2">
          <BaseButton @click="handleSaveProfile" :disabled="!editForm.name || !editForm.email" block>
            Save Changes
          </BaseButton>
          <BaseButton @click="closeEditDrawer" variant="secondary" block> Cancel </BaseButton>
        </div>
      </div>
    </DetailDrawerLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { User as UserIcon, LogOut, Edit2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import DetailDrawerLayout from '@/components/layout/DetailDrawerLayout.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const authStore = useAuthStore()
const router = useRouter()

const isEditDrawerOpen = ref(false)
const editForm = ref({ username: '', name: '', email: '' })

const openEditDrawer = () => {
  editForm.value = {
    username: authStore.user?.username ?? '',
    name: authStore.user?.username ?? '',
    email: authStore.user?.email ?? '',
  }
  isEditDrawerOpen.value = true
}

const closeEditDrawer = () => {
  isEditDrawerOpen.value = false
}

watch(
  () => authStore.user,
  (user) => {
    if (user && isEditDrawerOpen.value) {
      editForm.value = { username: user.username, name: user.username, email: user.email }
    }
  },
  { deep: true }
)

const handleSaveProfile = async () => {
  try {
    await authStore.updateProfile({
      name: editForm.value.name,
      email: editForm.value.email,
    })
    closeEditDrawer()
  } catch (error) {
    console.error('Update profile failed:', error)
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/auth/login')
}
</script>
