import { defineStore } from 'pinia'
import api from '@/services/api'
import { useUiStore } from './ui'
import { useTransactionStore } from './transaction'

export interface Budget {
  id: number
  categoryId: number
  categoryName: string
  amount: number
  month: string
  year: string
}

export type BudgetStatus = 'on_track' | 'warning' | 'exceeded'

export interface BudgetWithUsage extends Budget {
  used: number
  remaining: number
  status: BudgetStatus
  percentUsed: number
}

interface BudgetState {
  budgets: Budget[]
  loading: boolean
}

export const useBudgetStore = defineStore('budget', {
  state: (): BudgetState => ({
    budgets: [],
    loading: false,
  }),
  getters: {
    budgetsWithUsage(): BudgetWithUsage[] {
      const transactionStore = useTransactionStore()
      const byCategory = transactionStore.expensesByCategoryForMonth || {}

      return this.budgets.map((b) => {
        const used = byCategory[b.categoryName] || 0
        const remaining = Math.max(0, b.amount - used)
        const percentUsed = b.amount > 0 ? (used / b.amount) * 100 : 0
        let status: BudgetStatus = 'on_track'
        if (percentUsed >= 100) status = 'exceeded'
        else if (percentUsed >= 80) status = 'warning'

        return {
          ...b,
          used,
          remaining,
          status,
          percentUsed,
        }
      })
    },
    budgetsForCurrentMonth(): BudgetWithUsage[] {
      const now = new Date()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const year = String(now.getFullYear())
      return this.budgetsWithUsage.filter((b) => b.month === month && b.year === year)
    },
  },
  actions: {
    async fetchBudgets(params?: { month?: string; year?: string }) {
      this.loading = true
      try {
        const response = await api.get('/api/budgets', { params })
        this.budgets = response.data.response || []
      } catch (error) {
        console.error('Fetch budgets failed:', error)
      } finally {
        this.loading = false
      }
    },
    async createBudget(data: Partial<Budget>) {
      const uiStore = useUiStore()
      uiStore.setLoading(true, 'Creating budget...')
      try {
        const response = await api.post('/api/budgets', data)
        await this.fetchBudgets()
        return response.data
      } catch (error) {
        throw error
      } finally {
        uiStore.setLoading(false)
      }
    },
    async updateBudget(id: number, data: Partial<Budget>) {
      const uiStore = useUiStore()
      uiStore.setLoading(true, 'Updating budget...')
      try {
        await api.put(`/api/budgets/${id}`, data)
        await this.fetchBudgets()
      } catch (error) {
        throw error
      } finally {
        uiStore.setLoading(false)
      }
    },
    async deleteBudget(id: number) {
      const uiStore = useUiStore()
      uiStore.setLoading(true, 'Deleting budget...')
      try {
        await api.delete(`/api/budgets/${id}`)
        this.budgets = this.budgets.filter((b) => b.id !== id)
      } catch (error) {
        throw error
      } finally {
        uiStore.setLoading(false)
      }
    },
    async autoGenerateBudgets(data: {
      sourceMonth: string
      sourceYear: string
      targetMonth: string
      targetYear: string
    }) {
      const uiStore = useUiStore()
      uiStore.setLoading(true, 'Generating budgets...')
      try {
        const response = await api.post('/api/budgets/autogenerate', data)
        await this.fetchBudgets({ month: data.targetMonth, year: data.targetYear })
        return response.data
      } catch (error) {
        console.error('Auto generate failed:', error)
        throw error
      } finally {
        uiStore.setLoading(false)
      }
    },
  },
})
