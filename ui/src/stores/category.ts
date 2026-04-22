import { defineStore } from 'pinia'
import api from '@/services/api'
import { useUiStore } from './ui'

export interface Category {
  id: number
  name: string
  type: 'INCOME' | 'EXPENSE'
}

interface CategoryState {
  categories: Category[]
  loading: boolean
}

export const useCategoryStore = defineStore('category', {
  state: (): CategoryState => ({
    categories: [],
    loading: false,
  }),
  actions: {
    async fetchCategories() {
      this.loading = true
      try {
        const response = await api.get('/api/categories')
        this.categories = response.data.response || []
      } catch (error) {
        console.error('Fetch categories failed:', error)
      } finally {
        this.loading = false
      }
    },
    async createCategory(data: Partial<Category>) {
      const uiStore = useUiStore()
      uiStore.setLoading(true, 'Creating category...')
      try {
        const response = await api.post('/api/categories', data)
        await this.fetchCategories()
        return response.data
      } catch (error) {
        throw error
      } finally {
        uiStore.setLoading(false)
      }
    },
    async updateCategory(id: number, data: Partial<Category>) {
      const uiStore = useUiStore()
      uiStore.setLoading(true, 'Updating category...')
      try {
        const response = await api.put(`/api/categories/${id}`, data)
        await this.fetchCategories()
        return response.data
      } catch (error) {
        throw error
      } finally {
        uiStore.setLoading(false)
      }
    },
    async deleteCategory(id: number) {
      const uiStore = useUiStore()
      uiStore.setLoading(true, 'Deleting category...')
      try {
        await api.delete(`/api/categories/${id}`)
        this.categories = this.categories.filter((c) => c.id !== id)
      } catch (error) {
        throw error
      } finally {
        uiStore.setLoading(false)
      }
    },
  },
})
