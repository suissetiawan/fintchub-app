import axios from 'axios'
import { API_CONFIG } from '@/config/api'

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const setupInterceptors = (authStore: any) => {
  api.interceptors.request.use(
    (config) => {
      if (authStore.accessToken) {
        config.headers.Authorization = `Bearer ${authStore.accessToken}`
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  api.interceptors.response.use(
    (response) => {
      // Silently ignore 405 responses for auth endpoints (GET requests)
      if (response.status === 405 && response.config?.url?.includes('/auth/')) {
        return Promise.resolve({
          ...response,
          data: { message: 'Method not allowed' },
        })
      }
      return response
    },
    async (error) => {
      const status = error.response?.status
      const url = error.config?.url

      // Silently ignore 405 errors for auth endpoints (GET requests)
      if (status === 405 && url?.includes('/auth/')) {
        return Promise.resolve({
          data: { message: 'Method not allowed' },
          status: 405,
          statusText: 'Method Not Allowed',
          config: error.config,
        })
      }

      const originalRequest = error.config
      const isAuthRequest = originalRequest?.url?.includes('/auth/')

      // Don't retry for 4xx errors (client errors) except 401
      if (
        status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !isAuthRequest
      ) {
        originalRequest._retry = true
        try {
          await authStore.refreshTokenAction()
          return api(originalRequest)
        } catch (refreshError) {
          console.error('[API] Token refresh failed, logging out...')
          authStore.logout()
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    },
  )
}

export default api
