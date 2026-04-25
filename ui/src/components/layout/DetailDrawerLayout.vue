<template>
  <BaseModalLayout
    :is-open="isOpen"
    :title="title"
    :custom-height="heightClass ? undefined : undefined"
    size="lg"
    @close="close"
  >
    <slot></slot>
  </BaseModalLayout>
</template>

<script setup lang="ts">
import BaseModalLayout from '@/components/common/BaseModalLayout.vue'

defineProps<{
  isOpen: boolean
  title: string
  heightClass?: string
}>()

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}
</script>
