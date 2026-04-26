import { defineStore } from 'pinia'
import api from '@/services/api'

export interface Summary {
  balance: number
  income: number
  expense: number
  dailySpending: number
}

export interface Breakdown {
  category: string
  amount: number
  color: string
}

interface DashboardState {
  summary: Summary
  breakdown: Breakdown[]
  loading: boolean
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    summary: {
      balance: 0,
      income: 0,
      expense: 0,
      dailySpending: 0,
    },
    breakdown: [],
    loading: false,
  }),
  actions: {
    async fetchDashboardData(params?: { startDate?: string; endDate?: string }) {
      this.loading = true
      try {
        const [summaryRes, breakdownRes] = await Promise.all([
          api.get('/api/dashboard/summary', { params }),
          api.get('/api/dashboard/breakdown', { params }),
        ])
        this.summary = summaryRes.data.response
        this.breakdown = breakdownRes.data.response
      } catch (error) {
        console.error('Fetch dashboard data failed:', error)
      } finally {
        this.loading = false
      }
    },
  },
})
