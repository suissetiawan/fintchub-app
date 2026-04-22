<template>
  <ThemeProvider>
    <RouterView />
    <LoadingOverlay />
  </ThemeProvider>
</template>

<script setup lang="ts">
import ThemeProvider from './components/layout/ThemeProvider.vue'
import LoadingOverlay from './components/common/LoadingOverlay.vue'
</script>
