<template>
  <div class="space-y-4 sm:space-y-6 max-w-2xl mx-auto">
    <!-- Loading State -->
    <div v-if="!authStore.user" class="space-y-6">
      <div class="flex flex-col items-center space-y-4">
        <BaseSkeleton width="w-24" height="h-24" rounded="full" />
        <BaseSkeleton width="w-48" height="h-8" />
        <BaseSkeleton width="w-32" height="h-4" />
      </div>
      <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 space-y-8 shadow-sm">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div v-for="i in 3" :key="i" class="space-y-2">
            <BaseSkeleton width="w-20" height="h-3" />
            <BaseSkeleton width="w-32" height="h-5" />
          </div>
        </div>
        <div class="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-3">
          <BaseSkeleton width="w-full" height="h-12" rounded="xl" />
          <BaseSkeleton width="w-full" height="h-12" rounded="xl" />
        </div>
      </div>
    </div>

    <!-- Profile Header -->
    <template v-else>
      <div class="text-center space-y-3 sm:space-y-4">
      <div
        class="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 font-black text-3xl"
      >
        {{ authStore.userInitials }}
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
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</p>
          <p class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            {{ authStore.user?.name }}
          </p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Account Role</p>
          <div
            class="inline-flex items-center px-3 py-1 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400 text-sm font-bold"
          >
            {{ authStore.user?.role }}
          </div>
        </div>

      </div>

      <div class="pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3">
        <BaseButton
          @click="openEditDrawer"
          variant="secondary"
          block
          size="lg"
        >
          <template #icon-left><Edit2 :size="18" /></template>
          Edit Profile
        </BaseButton>
        <BaseButton
          @click="openChangePasswordDrawer"
          variant="secondary"
          block
          size="lg"
          class="!bg-cyan-50 !text-cyan-600 dark:!bg-cyan-900/20 dark:!text-cyan-400 hover:!bg-cyan-100"
        >
          <template #icon-left><Key :size="18" /></template>
          Ubah Password
        </BaseButton>
        <BaseButton
          @click="handleLogout"
          variant="danger"
          block
          size="lg"
        >
          <template #icon-left><LogOut :size="18" /></template>
          Sign Out
        </BaseButton>
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
            class="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-600 outline-none dark:text-white text-sm"
            placeholder="Your username"
          />
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
          <input
            v-model="editForm.name"
            type="text"
            class="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-600 outline-none dark:text-white text-sm"
            placeholder="Your display name"
          />
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
          <input
            v-model="editForm.email"
            type="email"
            class="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-600 outline-none dark:text-white text-sm"
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

    <!-- Change Password Drawer -->
    <DetailDrawerLayout
      :is-open="isPasswordDrawerOpen"
      title="Ubah Password"
      @close="closeChangePasswordDrawer"
      height-class="h-auto max-h-[90vh]"
    >
      <div class="space-y-5">
        <div v-if="passwordError" class="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold">
          {{ passwordError }}
        </div>
        
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Password Lama</label>
          <input
            v-model="passwordForm.oldPassword"
            type="password"
            class="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-600 outline-none dark:text-white text-sm"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Password Baru</label>
          <input
            v-model="passwordForm.newPassword"
            type="password"
            class="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-600 outline-none dark:text-white text-sm"
            placeholder="Min. 6 karakter"
          />
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Konfirmasi Password Baru</label>
          <input
            v-model="passwordForm.confirmPassword"
            type="password"
            class="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-600 outline-none dark:text-white text-sm"
            placeholder="Ulangi password baru"
          />
        </div>
        
        <div class="flex flex-col gap-3 pt-2">
          <BaseButton 
            @click="handleChangePassword" 
            :disabled="!passwordForm.oldPassword || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword || passwordForm.newPassword.length < 6" 
            block
          >
            Update Password
          </BaseButton>
          <BaseButton @click="closeChangePasswordDrawer" variant="secondary" block> Batal </BaseButton>
        </div>
      </div>
    </DetailDrawerLayout>
  </template>
</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { LogOut, Edit2, Key } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import DetailDrawerLayout from '@/components/layout/DetailDrawerLayout.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseSkeleton from '@/components/common/BaseSkeleton.vue'

const authStore = useAuthStore()
const router = useRouter()

const isEditDrawerOpen = ref(false)
const editForm = ref({ username: '', name: '', email: '' })

const isPasswordDrawerOpen = ref(false)
const passwordError = ref('')
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const openChangePasswordDrawer = () => {
  passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
  passwordError.value = ''
  isPasswordDrawerOpen.value = true
}

const closeChangePasswordDrawer = () => {
  isPasswordDrawerOpen.value = false
}

const handleChangePassword = async () => {
  passwordError.value = ''
  try {
    await authStore.changePassword({
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword
    })
    closeChangePasswordDrawer()
    // Success toast or alert would be nice here
  } catch (error: any) {
    passwordError.value = error.response?.data?.message || 'Gagal mengubah password.'
    console.error('Change password failed:', error)
  }
}

const openEditDrawer = () => {
  editForm.value = {
    username: authStore.user?.username ?? '',
    name: authStore.user?.name ?? '',
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
      editForm.value = { 
        username: user.username, 
        name: user.name || user.username, 
        email: user.email 
      }
    }
  },
  { deep: true }
)

const handleSaveProfile = async () => {
  try {
    await authStore.updateProfile({
      username: editForm.value.username,
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
