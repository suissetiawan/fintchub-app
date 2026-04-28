<template>
  <div
    class="flex flex-col min-h-screen items-center justify-center p-6 bg-gray-50 dark:bg-gray-950"
  >
    <div
      class="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800"
    >
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
        <p class="text-gray-500 mt-2 dark:text-gray-400">Join FinTracker today</p>
      </div>

      <!-- Messages Banners -->
      <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-900/30 text-sm font-medium flex items-start gap-3">
        <AlertCircle :size="18" class="shrink-0 mt-0.5" />
        <p>{{ errorMessage }}</p>
      </div>

      <div v-if="successMessage" class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-2xl border border-green-100 dark:border-green-900/30 text-sm font-medium flex items-start gap-3">
        <CheckCircle :size="18" class="shrink-0 mt-0.5" />
        <p>{{ successMessage }}</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >Username</label
          >
          <input
            v-model="form.username"
            type="text"
            required
            class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Choose a username"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >Email Address</label
          >
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >Password</label
          >
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >Role</label
          >
          <select
            v-model="form.role"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-3 mt-4 rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {{ loading ? 'Creating Account...' : 'Sign Up' }}
        </button>
      </form>

      <div class="mt-8 text-center text-sm">
        <span class="text-gray-500 dark:text-gray-400">Already have an account? </span>
        <router-link to="/auth/login" class="text-blue-600 font-bold hover:underline"
          >Log In</router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { AlertCircle, CheckCircle } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  email: '',
  password: '',
  role: 'USER',
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleRegister = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    await authStore.register(form.value)
    successMessage.value = 'Account created! Redirecting to login...'
    setTimeout(() => {
      router.push('/auth/login')
    }, 2000)
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>
