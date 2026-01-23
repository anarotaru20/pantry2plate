import { defineStore } from 'pinia'
import { addLocation, deleteLocation, getLocations, updateLocation } from '@/services/locations'

export const useLocationsStore = defineStore('locations', {
  state: () => ({
    locations: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchLocations() {
      this.loading = true
      this.error = null
      try {
        this.locations = await getLocations()
      } catch (e) {
        this.error = e.message || 'Failed to fetch locations'
      } finally {
        this.loading = false
      }
    },

    async addLocation(payload) {
      this.error = null
      try {
        const location = await addLocation(payload)
        this.locations = [location, ...this.locations]
        return location
      } catch (e) {
        this.error = e.message || 'Failed to add location'
        throw e
      }
    },

    async updateLocation(id, payload) {
      this.error = null
      try {
        const updated = await updateLocation(id, payload)
        this.locations = this.locations.map((l) => (l.id === id ? updated : l))
        return updated
      } catch (e) {
        this.error = e.message || 'Failed to update location'
        throw e
      }
    },

    async deleteLocation(id) {
      this.error = null
      try {
        await deleteLocation(id)
        this.locations = this.locations.filter((l) => l.id !== id)
        return true
      } catch (e) {
        this.error = e.message || 'Failed to delete location'
        throw e
      }
    },
  },
})
