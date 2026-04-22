import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    isLoading: false,
    loadingMessage: '',
  }),
  actions: {
    setLoading(loading: boolean, message: string = 'Processing...') {
      this.isLoading = loading
      this.loadingMessage = message
    },
  },
})
