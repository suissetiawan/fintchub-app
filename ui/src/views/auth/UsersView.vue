<template>
  <PullToRefresh :on-refresh="userStore.fetchUsers">
    <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
      <button
        @click="openAddDrawer"
        class="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
      >
        <UserPlus :size="20" />
      </button>
    </div>

    <!-- User List -->
    <div class="space-y-3 pb-28">
      <div v-if="userStore.loading && userStore.users.length === 0">
        <BaseListSkeleton :count="5" avatar-rounded="full" avatar-size="w-12" />
      </div>

      <template v-else-if="userStore.users.length > 0">
        <div
          v-for="u in userStore.users"
          :key="u.id"
          class="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:border-blue-100 dark:hover:border-blue-900/30 cursor-pointer active:scale-[0.98]"
          @click="openDetails(u)"
        >
          <div class="flex items-center gap-3">
            <div
              class="h-12 w-12 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center font-black text-sm"
            >
              {{ getInitials(u.name || u.username) }}
            </div>
            <div>
              <p class="font-bold text-gray-900 dark:text-white">{{ u.username }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ u.email }}</p>
            </div>
          </div>
          <div class="flex flex-col items-end gap-1">
            <span
              :class="
                u.role === 'ADMIN'
                  ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                  : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
              "
              class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
            >
              {{ u.role }}
            </span>
            <ChevronRight :size="16" class="text-gray-300" />
          </div>
        </div>
      </template>

      <div v-else class="flex flex-col items-center justify-center py-20 text-center">
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-full mb-4">
          <Users :size="40" class="text-gray-300" />
        </div>
        <h3 class="font-bold text-gray-900 dark:text-white">No users found</h3>
      </div>
    </div>

    <!-- User Detail Drawer -->
    <UserDetailDrawer :is-open="isDrawerOpen" :user="selectedUser" @close="closeDrawer" />
  </PullToRefresh>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { UserPlus, Users, ChevronRight } from 'lucide-vue-next'
import { useUserStore, type User } from '@/stores/user'
import UserDetailDrawer from '@/components/users/UserDetailDrawer.vue'
import BaseSkeleton from '@/components/common/BaseSkeleton.vue'
import BaseListSkeleton from '@/components/common/BaseListSkeleton.vue'
import PullToRefresh from '@/components/common/PullToRefresh.vue'
import { getInitials } from '@/utils/stringHelper'

const userStore = useUserStore()

const isDrawerOpen = ref(false)
const selectedUser = ref<User | null>(null)

const openAddDrawer = () => {
  selectedUser.value = null
  isDrawerOpen.value = true
}

const openDetails = (u: User) => {
  selectedUser.value = u
  isDrawerOpen.value = true
}

const closeDrawer = () => {
  isDrawerOpen.value = false
}

onMounted(() => {
  userStore.fetchUsers()
})
</script>
