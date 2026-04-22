<template>
  <router-link to="/" class="flex items-center gap-3">
    <div class="w-9 h-9 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center shrink-0 shadow-sm shadow-blue-200 dark:shadow-none">
      <Wallet class="w-5 h-5 text-white" />
    </div>
    <span class="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
      Fincthub
    </span>
  </router-link>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Wallet } from 'lucide-vue-next'
</script>
