import { defineStore } from 'pinia'
import api from '@/services/api'
import { useUiStore } from './ui'

export interface User {
  id: number
  username: string
  email: string
  role: 'USER' | 'ADMIN'
}

interface UserState {
  users: User[]
  loading: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    loading: false,
  }),
  actions: {
    async fetchUsers() {
      this.loading = true
      try {
        const response = await api.get('/api/users')
        this.users = response.data.response || []
      } catch (error) {
        console.error('Fetch users failed:', error)
      } finally {
        this.loading = false
      }
    },
    async createUser(data: Partial<User>) {
      const uiStore = useUiStore()
      uiStore.setLoading(true, 'Creating user...')
      try {
        const response = await api.post('/api/users', data) // Using dedicated endpoint for Admin creation
        await this.fetchUsers()
        return response.data
      } catch (error) {
        throw error
      } finally {
        uiStore.setLoading(false)
      }
    },
    async updateUser(id: number, data: Partial<User>) {
      const uiStore = useUiStore()
      uiStore.setLoading(true, 'Updating user...')
      try {
        const response = await api.put(`/api/users/${id}`, data)
        await this.fetchUsers()
        return response.data
      } catch (error) {
        throw error
      } finally {
        uiStore.setLoading(false)
      }
    },
    async deleteUser(id: number) {
      const uiStore = useUiStore()
      uiStore.setLoading(true, 'Deleting user...')
      try {
        await api.delete(`/api/users/${id}`)
        this.users = this.users.filter((u) => u.id !== id)
      } catch (error) {
        throw error
      } finally {
        uiStore.setLoading(false)
      }
    },
  },
})
