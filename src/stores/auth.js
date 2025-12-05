import { defineStore } from 'pinia'
import api from '@/api'
import router from '@/router'
import socket from '@/socket'
import { UserService } from '@/shared/services'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    isLoggedIn: state => !!state.token,
    userData: state => state.user,
    hasPermission: state => permissions => {
      if (!state.user?.permissions) return false
      if (typeof permissions === 'string') {
        return state.user.permissions.includes(permissions)
      }
      return permissions.some(permission => state.user.permissions.includes(permission))
    },
  },

  actions: {
    async signIn(payload) {
      try {
        this.loading = true
        const res = await api.post('/auth/login', payload)
        localStorage.setItem('token', `Bearer ${res.data.accessToken}`)
        await this.getUserData()
        return res
      } catch (error) {
        this.error = error
        throw error
      } finally {
        this.loading = false
      }
    },

    async signUp(payload) {
      try {
        this.loading = true
        const { data } = await api.post('/auth/registration', payload)
        localStorage.setItem('token', `Bearer ${data.accessToken}`)
        await this.getUserData()
        return data
      } catch (error) {
        this.error = error
        throw error
      } finally {
        this.loading = false
      }
    },

    async getUserData() {
      try {
        this.loading = true
        const { data } = await UserService.getCurrentUser()
        this.user = data
        return data
      } catch (error) {
        this.error = error
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUserData(payload) {
      try {
        this.loading = true
        const { data } = await UserService.updateCurrentUser(payload)
        this.user = { ...this.user, ...data }
        return data
      } catch (error) {
        this.error = error
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      localStorage.removeItem('token')
      this.token = null
      this.user = null
      socket.disconnect()
      router.push({ name: 'Login' })
    },

    clearDirectories() {
      if (this.user?.directoriesProfile) {
        this.user.directoriesProfile = null
      }
    },

    clearError() {
      this.error = null
    },
  },
})
