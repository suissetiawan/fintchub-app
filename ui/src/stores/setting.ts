import { defineStore } from 'pinia'
import api from '@/services/api'

export interface SettingState {
  hideAmounts: boolean
  settings: Record<string, string>
  loading: boolean
}

export const useSettingStore = defineStore('setting', {
  state: (): SettingState => ({
    hideAmounts: false,
    settings: {},
    loading: false,
  }),
  actions: {
    async fetchSettings() {
      this.loading = true
      try {
        const res = await api.get('/api/settings')
        this.settings = res.data.response || {}
        
        // Initialize hideAmounts from DB if available
        if (this.settings['hide_amounts'] === 'true') {
          this.hideAmounts = true
        } else if (this.settings['hide_amounts'] === 'false') {
          this.hideAmounts = false
        }
        
        // Defaults for monitoring period
        if (!this.settings['monitor_period_type']) {
          this.settings['monitor_period_type'] = 'calendar'
        }
        if (!this.settings['monitor_payday_date']) {
          this.settings['monitor_payday_date'] = '25'
        }
        if (!this.settings['color_theme']) {
          this.settings['color_theme'] = 'blue'
        }
      } catch (error) {
        console.error('Fetch settings failed:', error)
      } finally {
        this.loading = false
      }
    },
    async toggleHideAmounts() {
      this.hideAmounts = !this.hideAmounts
      await this.saveSetting('hide_amounts', this.hideAmounts.toString())
    },
    async setMonitorPeriod(type: 'calendar' | 'payday', date?: number) {
      this.settings['monitor_period_type'] = type
      await this.saveSetting('monitor_period_type', type)
      if (date) {
        this.settings['monitor_payday_date'] = date.toString()
        await this.saveSetting('monitor_payday_date', date.toString())
      }
    },
    async saveSetting(key: string, value: string) {
      try {
        this.settings[key] = value
        await api.post('/api/settings', { key, value })
      } catch (error) {
        console.error('Save setting failed:', error)
      }
    }
  }
})
