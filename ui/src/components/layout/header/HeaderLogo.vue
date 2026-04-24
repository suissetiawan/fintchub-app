<template>
  <router-link to="/" class="flex items-center gap-3">
    <div class="w-9 h-9 flex items-center justify-center shrink-0">
      <img src="/plain_logo.png" alt="Fincthub Logo" class="w-full h-full object-contain" />
    </div>
    <span class="text-xl font-bold text-gray-900 dark:text-white tracking-wider">
      Fincthub
    </span>
  </router-link>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
