<template>
  <div
    class="relative flex flex-col min-h-screen items-center justify-center p-4 sm:p-6 bg-gray-50 dark:bg-gray-950"
  >
    <!-- Theme toggle top-right -->
    <div class="absolute top-4 right-4">
      <ThemeToggler />
    </div>

    <!-- Brand Logo & Title (Moved Outside) -->
    <div class="flex items-center justify-center gap-2.5 mb-6">
      <div class="w-10 h-10 flex items-center justify-center animate-bounce-subtle shrink-0">
        <img src="/plain_logo.png" alt="Fincthub Logo" class="w-full h-full object-contain" />
      </div>
      <span class="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase">Fincthub</span>
    </div>

    <div
      class="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800"
    >
      <div class="text-center mb-6 sm:mb-8">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
        <p class="text-xs sm:text-sm text-gray-500 mt-1 dark:text-gray-400">Log in to your account</p>
      </div>

      <!-- Error Message Banner -->
      <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-900/30 text-sm font-medium flex items-start gap-3">
        <AlertCircle :size="18" class="shrink-0 mt-0.5" />
        <p>{{ errorMessage }}</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5 sm:space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2"
            >Email</label
          >
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Enter your email"
          />
        </div>

        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2"
            >Password</label
          >
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white pr-10 sm:pr-12"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
            >
              <Eye v-if="!showPassword" class="w-5 h-5 sm:w-6 sm:h-6" />
              <EyeOff v-else class="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        <BaseButton
          type="submit"
          block
          :loading="loading"
        >
          Log In
        </BaseButton>
      </form>

      <div v-if="!authStore.usersExist" class="mt-6 sm:mt-8 text-center text-sm">
        <span class="text-gray-500 dark:text-gray-400">Don't have an account? </span>
        <router-link to="/auth/register" class="text-brand-600 font-bold hover:underline"
          >Sign Up</router-link
        >
      </div>
    </div>

    <!-- Extra page footer -->
    <div class="mt-6 text-gray-400 text-xs dark:text-gray-600 font-medium tracking-wide">
      &copy; 2026 Fincthub App. All rights reserved.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Eye, EyeOff, AlertCircle } from 'lucide-vue-next'
import ThemeToggler from '@/components/common/ThemeToggler.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: '',
})

const loading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    await authStore.login(form.value)
    router.push('/')
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  authStore.checkSetupStatus()
})
</script>
