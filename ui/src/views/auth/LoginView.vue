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
      <div class="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-200 dark:shadow-none animate-bounce-subtle">
        <Wallet class="w-5 h-5 text-white" />
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

      <form @submit.prevent="handleLogin" class="space-y-5 sm:space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2"
            >Email</label
          >
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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
              class="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white pr-10 sm:pr-12"
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

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none text-sm sm:text-base"
        >
          {{ loading ? 'Logging in...' : 'Log In' }}
        </button>
      </form>

      <div v-if="!authStore.usersExist" class="mt-6 sm:mt-8 text-center text-sm">
        <span class="text-gray-500 dark:text-gray-400">Don't have an account? </span>
        <router-link to="/auth/register" class="text-blue-600 font-bold hover:underline"
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
import { Eye, EyeOff, Wallet } from 'lucide-vue-next'
import ThemeToggler from '@/components/common/ThemeToggler.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: '',
})

const loading = ref(false)
const showPassword = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    await authStore.login(form.value)
    router.push('/')
  } catch (error: any) {
    alert(error.response?.data?.message || 'Login failed')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  authStore.checkSetupStatus()
})
</script>
