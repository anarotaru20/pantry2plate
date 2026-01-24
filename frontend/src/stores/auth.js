import { defineStore } from 'pinia'
import * as authApi from '@/services/auth'
import { useProfileStore } from '@/stores/profile'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('jwt') || '',
    user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
  }),

  getters: {
    isAuthenticated: (s) => !!s.token,
  },

  actions: {
    async login(email, password) {
      const data = await authApi.login(email, password)
      this.token = data?.token || ''
      localStorage.setItem('jwt', this.token)

      const profileStore = useProfileStore()
      await profileStore.fetchProfile()
      this.user = profileStore.profile

      return data
    },

    async register(email, password, profile) {
      const data = await authApi.register(email, password, profile)
      this.token = data?.token || ''
      localStorage.setItem('jwt', this.token)

      const profileStore = useProfileStore()
      await profileStore.fetchProfile()
      this.user = profileStore.profile

      return data
    },

    async hydrate() {
      if (!this.token) return
      const profileStore = useProfileStore()
      await profileStore.fetchProfile()
      this.user = profileStore.profile
    },

    logout() {
      authApi.logout()
      this.token = ''
      this.user = null

      localStorage.removeItem('jwt')
      localStorage.removeItem('auth_user')

      const profileStore = useProfileStore()
      profileStore.clear()
    },
  },
})
