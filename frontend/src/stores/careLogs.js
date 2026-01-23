import { defineStore } from 'pinia'
import {
  getCareLogs,
  addCareLog,
  updateCareLog,
  deleteCareLog,
} from '@/services/careLogs'

export const useCareLogsStore = defineStore('careLogs', {
  state: () => ({
    careLogs: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchCareLogs() {
      this.loading = true
      this.error = null
      try {
        this.careLogs = await getCareLogs()
      } catch (e) {
        this.error = e.message || 'Failed to fetch care logs'
      } finally {
        this.loading = false
      }
    },

    async addCareLog(payload) {
      this.error = null
      try {
        const careLog = await addCareLog(payload)
        this.careLogs = [careLog, ...this.careLogs]
        return careLog
      } catch (e) {
        this.error = e.message || 'Failed to add care log'
        throw e
      }
    },

    async updateCareLog(id, payload) {
      this.error = null
      try {
        const updated = await updateCareLog(id, payload)
        this.careLogs = this.careLogs.map((c) =>
          c.id === id ? updated : c
        )
        return updated
      } catch (e) {
        this.error = e.message || 'Failed to update care log'
        throw e
      }
    },

    async deleteCareLog(id) {
      this.error = null
      try {
        await deleteCareLog(id)
        this.careLogs = this.careLogs.filter((c) => c.id !== id)
        return true
      } catch (e) {
        this.error = e.message || 'Failed to delete care log'
        throw e
      }
    },
  },
})
