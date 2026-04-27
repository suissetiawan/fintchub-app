<template>
  <div class="space-y-3">
    <div
      v-for="i in count"
      :key="i"
      class="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex justify-between items-center shadow-sm"
    >
      <div class="flex items-center gap-3">
        <BaseSkeleton
          v-if="showAvatar"
          :width="avatarSize"
          :height="avatarSize"
          :rounded="avatarRounded"
        />
        <div class="space-y-2">
          <BaseSkeleton width="w-32" height="h-4" />
          <BaseSkeleton width="w-24" height="h-3" />
        </div>
      </div>
      <BaseSkeleton v-if="showAction" width="w-16" height="h-6" rounded="full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseSkeleton from './BaseSkeleton.vue'

interface Props {
  count?: number
  showAvatar?: boolean
  showAction?: boolean
  avatarSize?: string
  avatarRounded?: 'full' | 'xl' | 'lg' | 'md' | 'sm'
}

withDefaults(defineProps<Props>(), {
  count: 3,
  showAvatar: true,
  showAction: true,
  avatarSize: 'w-10',
  avatarRounded: 'xl',
})
</script>
