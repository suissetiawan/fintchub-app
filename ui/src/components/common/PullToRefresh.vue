<template>
  <div
    class="pull-to-refresh-container"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- Pull Indicator -->
    <div
      class="pull-indicator"
      :style="{
        transform: `translateY(${Math.min(pullDistance, maxPullDistance)}px)`,
        opacity: pullDistance > 10 ? 1 : 0,
        transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease'
      }"
    >
      <div class="indicator-content">
        <div v-if="isRefreshing" class="spinner"></div>
        <ArrowDown
          v-else
          :size="20"
          :style="{
            transform: `rotate(${pullDistance > refreshThreshold ? 180 : 0}deg)`,
            transition: 'transform 0.2s ease'
          }"
        />
      </div>
    </div>

    <!-- Main Content -->
    <div
      class="refresh-content"
      :style="{
        transform: `translateY(${isRefreshing ? 60 : Math.min(pullDistance * 0.4, 60)}px)`,
        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
      }"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowDown } from 'lucide-vue-next'

const props = defineProps<{
  onRefresh: () => Promise<void>
}>()

const pullDistance = ref(0)
const isDragging = ref(false)
const isRefreshing = ref(false)
const startY = ref(0)

const refreshThreshold = 80
const maxPullDistance = 120

const handleTouchStart = (e: TouchEvent) => {
  if (window.scrollY === 0 && !isRefreshing.value) {
    startY.value = e.touches[0].clientY
    isDragging.value = true
  }
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return

  const currentY = e.touches[0].clientY
  const diff = currentY - startY.value

  if (diff > 0) {
    pullDistance.value = diff
    // Prevent default only if we are pulling down at the top
    if (e.cancelable) e.preventDefault()
  } else {
    pullDistance.value = 0
    isDragging.value = false
  }
}

const handleTouchEnd = async () => {
  if (!isDragging.value) return
  isDragging.value = false

  if (pullDistance.value >= refreshThreshold) {
    isRefreshing.value = true
    pullDistance.value = 0
    try {
      await props.onRefresh()
    } finally {
      isRefreshing.value = false
    }
  } else {
    pullDistance.value = 0
  }
}
</script>

<style scoped>
.pull-to-refresh-container {
  position: relative;
  width: 100%;
  min-height: 100%;
  overflow: visible;
}

.pull-indicator {
  position: absolute;
  top: -40px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 40;
  pointer-events: none;
}

.indicator-content {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: #2563eb;
}

.dark .indicator-content {
  background: #1e293b;
  color: #3b82f6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.refresh-content {
  width: 100%;
  will-change: transform;
}
</style>
