import { defineStore } from 'pinia'
import * as profileApi from '@/services/profile'

const persistMinimalUser = (profile) => {
  const minimalUser = {
    displayName: profile?.displayName || '',
    firstName: profile?.firstName || '',
    lastLoginAt: profile?.lastLoginAt || '',
  }
  localStorage.setItem('auth_user', JSON.stringify(minimalUser))
}

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: null,
    loading: false,
    error: '',
  }),

  actions: {
    async fetchProfile() {
      this.loading = true
      this.error = ''
      try {
        const data = await profileApi.getProfile()
        this.profile = data?.user || null
        persistMinimalUser(this.profile)
        return data
      } catch (e) {
        this.error = e?.message || 'Failed to load profile'
        throw e
      } finally {
        this.loading = false
      }
    },

    async patchProfile(payload) {
      this.loading = true
      this.error = ''
      try {
        const data = await profileApi.updateProfile(payload)
        this.profile = data?.user || null
        persistMinimalUser(this.profile)
        return data
      } catch (e) {
        this.error = e?.message || 'Failed to update profile'
        throw e
      } finally {
        this.loading = false
      }
    },

    async changeEmail(idToken, email) {
      this.loading = true
      this.error = ''
      try {
        const data = await profileApi.updateEmail(idToken, email)
        this.profile = data?.user || this.profile
        persistMinimalUser(this.profile)
        return data
      } catch (e) {
        this.error = e?.message || 'Failed to update email'
        throw e
      } finally {
        this.loading = false
      }
    },

    async changePassword(idToken, password) {
      this.loading = true
      this.error = ''
      try {
        return await profileApi.updatePassword(idToken, password)
      } catch (e) {
        this.error = e?.message || 'Failed to update password'
        throw e
      } finally {
        this.loading = false
      }
    },

    async removeAccount() {
      this.loading = true
      this.error = ''
      try {
        return await profileApi.deleteAccount()
      } catch (e) {
        this.error = e?.message || 'Failed to delete account'
        throw e
      } finally {
        this.loading = false
      }
    },

    clear() {
      this.profile = null
      this.loading = false
      this.error = ''
    },
  },
})
