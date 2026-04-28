import { defineStore } from 'pinia'
import api from '@/services/api'
import { useUiStore } from './ui'

interface User {
  id: number | string
  username: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  usersExist: boolean
}

const safeParse = (key: string) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (e) {
    console.error(`Error parsing localStorage key "${key}":`, e)
    localStorage.removeItem(key)
    return null
  }
}

const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
}

import { getInitials } from '@/utils/stringHelper'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: safeParse('user'),
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    usersExist: true, // Default to true to hide sign-up until checked
  }),
  getters: {
    isLoggedIn: (state) => !!state.accessToken && state.accessToken !== 'undefined',
    isAdmin: (state) => state.user?.role === 'ADMIN',
    displayName: (state) => (state.user?.name ? state.user.name : state.user?.username || 'User'),
    userInitials: (state) => getInitials(state.user?.name || state.user?.username || 'User'),
  },
  actions: {
    async login(credentials: any) {
      const uiStore = useUiStore()
      uiStore.setLoading(true, 'Logging in...')
      try {
        const response = await api.post('/auth/login', credentials)
        const data = response.data.response

        this.accessToken = data.accessToken
        this.refreshToken = data.refreshToken

        const payload = parseJwt(this.accessToken!)

        const resProfile = await api.get('api/users/' + payload.sub)
        const profile = resProfile.data.response

        this.user = {
          id: profile.id,
          username: profile.username,
          name: profile.name,
          email: profile.email,
          role: profile.role,
        }

        localStorage.setItem('accessToken', this.accessToken!)
        localStorage.setItem('refreshToken', this.refreshToken!)
        localStorage.setItem('user', JSON.stringify(this.user))
        return response.data
      } catch (error) {
        throw error
      } finally {
        uiStore.setLoading(false)
      }
    },
    async register(userData: any) {
      try {
        const response = await api.post('/auth/register', userData)
        return response.data
      } catch (error) {
        throw error
      }
    },
    async refreshTokenAction() {
      if (!this.refreshToken) {
        this.logout()
        return
      }
      try {
        const response = await api.post('/auth/refresh', {
          refreshToken: this.refreshToken,
        })
        const data = response.data.response
        this.accessToken = data.accessToken
        localStorage.setItem('accessToken', this.accessToken!)
      } catch (error) {
        this.logout()
        throw error
      }
    },
    async logout() {
      const uiStore = useUiStore()
      uiStore.setLoading(true, 'Signing out...')
      try {
        if (this.accessToken) {
          await api.post('/auth/logout')
        }
      } catch (error) {
        console.error('Logout API failed:', error)
      } finally {
        this.accessToken = null
        this.refreshToken = null
        this.user = null
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        uiStore.setLoading(false)
      }
    },
    async updateProfile(data: { name?: string; username?: string; email?: string }) {
      if (!this.user?.id) return
      const uiStore = useUiStore()
      uiStore.setLoading(true, 'Updating profile...')
      try {
        await api.put(`api/users/${this.user.id}`, {
          name: data.name ?? this.user.name,
          username: data.username ?? this.user.username,
          email: data.email ?? this.user.email,
        })
        const resProfile = await api.get(`api/users/${this.user.id}`)
        const profile = resProfile.data.response
        this.user = {
          id: profile.id,
          username: profile.username,
          name: profile.name,
          email: profile.email,
          role: profile.role,
        }
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (error) {
        throw error
      } finally {
        uiStore.setLoading(false)
      }
    },
    async changePassword(data: any) {
      const uiStore = useUiStore()
      uiStore.setLoading(true, 'Updating password...')
      try {
        const response = await api.put('api/users/change-password', data)
        return response.data
      } catch (error) {
        throw error
      } finally {
        uiStore.setLoading(false)
      }
    },
    async checkSetupStatus() {
      try {
        const response = await api.get('/auth/setup-check')
        this.usersExist = response?.data?.response?.usersExist ?? true
        return this.usersExist
      } catch (error) {
        console.error('Setup check failed:', error)
        this.usersExist = true // Assume users exist on error to be safe
      }
    },
  },
})
