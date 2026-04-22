<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center text-gray-700 dark:text-gray-400"
      @click.prevent="toggleDropdown"
    >
      <span
        class="mr-3 overflow-hidden rounded-full h-11 w-11 bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
      >
        <UserCircleIcon :size="32" class="text-gray-400" />
      </span>

      <span class="block mr-1 font-medium text-theme-sm truncate max-w-[150px]">
        Hai, {{ authStore.displayName }}
      </span>

      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" />
    </button>

    <!-- Dropdown Start -->
    <div
      v-if="dropdownOpen"
      class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
    >
      <div class="flex items-center justify-between px-3 py-1">
        <div>
          <span class="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {{ authStore.displayName }}
          </span>
          <span
            class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]"
          >
            {{ authStore.user?.email || '' }}
          </span>
        </div>
        <ThemeToggler />
      </div>

      <ul class="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <li v-for="item in menuItems" :key="item.href">
          <router-link
            :to="item.href"
            class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <component
              :is="item.icon"
              class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
            />
            {{ item.text }}
          </router-link>
        </li>
      </ul>
      <button
        @click="signOut"
        class="flex items-center gap-3 w-full text-left px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
      >
        <LogoutIcon
          class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
        />
        Sign out
      </button>
    </div>
    <!-- Dropdown End -->
  </div>
</template>

<script setup>
import { UserCircleIcon, ChevronDownIcon, LogoutIcon, SettingsIcon, InfoCircleIcon, PieChartIcon } from '@/icons'
import ThemeToggler from '../../common/ThemeToggler.vue'
import { RouterLink, useRouter } from 'vue-router'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const dropdownOpen = ref(false)
const dropdownRef = ref(null)

const menuItems = computed(() => {
  const items = [
    { href: '/profile', icon: UserCircleIcon, text: 'Profile' },
    { href: '/categories', icon: SettingsIcon, text: 'Categories' },
    { href: '/budget', icon: PieChartIcon, text: 'Budget' },
  ]

  if (authStore.isAdmin) {
    items.push({ href: '/users', icon: InfoCircleIcon, text: 'User Management' })
  }

  return items
})

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const signOut = async () => {
  await authStore.logout()
  router.push('/auth/login')
  closeDropdown()
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
