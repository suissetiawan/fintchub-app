import { defineStore } from 'pinia'
import api from '@/services/api'
import { useUiStore } from './ui'

export interface Transaction {
  id: number
  description: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  category: string
  date: string
}

interface TransactionState {
  transactions: Transaction[]
  loading: boolean
  pagination: {
    page: number
    size: number
    total: number
    totalPages: number
  }
  summary: {
    income: number
    expense: number
  }
  /** Pengeluaran per kategori untuk bulan tertentu (untuk budget monitoring) */
  expensesByCategoryForMonth: Record<string, number>
}

export const useTransactionStore = defineStore('transaction', {
  state: (): TransactionState => ({
    transactions: [],
    loading: false,
    pagination: {
      page: 1,
      size: 10,
      total: 0,
      totalPages: 0,
    },
    summary: {
      income: 0,
      expense: 0,
    },
    expensesByCategoryForMonth: {},
  }),
  actions: {
    /** Load expense totals per category for a month (for budget overview) */
    async fetchExpensesByCategoryForMonth(month: string, year: string) {
      this.loading = true
      try {
        const response = await api.get('/api/transactions', {
          params: { month, year, size: 1 }, // We only need the breakdown, not the rows
        })
        this.expensesByCategoryForMonth = response.data.categoryBreakdown || {}
      } catch (error) {
        console.error('Fetch expenses by category failed:', error)
        this.expensesByCategoryForMonth = {}
      } finally {
        this.loading = false
      }
    },
    async fetchTransactions(params?: {
      month?: string
      year?: string
      limit?: string
      page?: number
      size?: number
    }, silent = false) {
      if (!silent) this.loading = true
      try {
        const response = await api.get('/api/transactions', { params })
        this.transactions = response.data.response || []
        if (response.data.pagination) {
          this.pagination = response.data.pagination
        }
        if (response.data.summary) {
          this.summary = response.data.summary
        }
        if (response.data.categoryBreakdown) {
          this.expensesByCategoryForMonth = response.data.categoryBreakdown
        }
      } catch (error) {
        console.error('Fetch transactions failed:', error)
      } finally {
        if (!silent) this.loading = false
      }
    },
    async createTransaction(data: any) {
      const uiStore = useUiStore()
      uiStore.setLoading(true, 'Saving transaction...')
      try {
        const response = await api.post('/api/transactions', data)
        await this.fetchTransactions() // Refresh list
        return response.data
      } catch (error) {
        throw error
      } finally {
        uiStore.setLoading(false)
      }
    },
    async deleteTransaction(id: number) {
      const uiStore = useUiStore()
      uiStore.setLoading(true, 'Deleting...')
      try {
        await api.delete(`/api/transactions/${id}`)
        await this.fetchTransactions() // Ensure consistent state
      } catch (error) {
        throw error
      } finally {
        uiStore.setLoading(false)
      }
    },
    async updateTransaction(id: number, data: any) {
      const uiStore = useUiStore()
      uiStore.setLoading(true, 'Updating transaction...')
      try {
        await api.put(`/api/transactions/${id}`, data)
        await this.fetchTransactions()
      } catch (error) {
        throw error
      } finally {
        uiStore.setLoading(false)
      }
    },
    async getTransactionById(id: number) {
      try {
        const response = await api.get(`/api/transactions/${id}`)
        return response.data.response
      } catch (error) {
        console.error('Fetch transaction detail failed:', error)
        throw error
      }
    },
  },
})
