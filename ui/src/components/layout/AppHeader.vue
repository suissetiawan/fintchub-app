<template>
  <header
    class="sticky top-0 flex w-full bg-white border-b border-gray-200 z-999 dark:border-gray-800 dark:bg-gray-900"
  >
    <div class="flex items-center justify-between w-full px-4 py-3 sm:px-6 lg:px-8">
      <div class="flex items-center gap-2">
        <HeaderLogo />
      </div>

      <div class="flex items-center">
        <UserMenu />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import HeaderLogo from './header/HeaderLogo.vue'
import UserMenu from './header/UserMenu.vue'
</script>
