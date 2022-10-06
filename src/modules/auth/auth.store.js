import api from '@/api'
import router from '@/router'
import socket from '@/socket'
import userService from './services/user.service'

export default {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
  }),
  mutations: {
    clearDirectories(state) {
      if (state.user?.directoriesProfile) state.user.directoriesProfile = null
    },
    setUser(state, payload) {
      state.user = payload
    },
    updateUser(state, payload) {
      state.user = { ...state.user, ...payload }
    },
    logOut(state) {
      state.token = null
      state.user = null
    },
  },
  actions: {
    signIn({ dispatch }, payload) {
      return new Promise((resolve, reject) => {
        api
          .post('/auth/login', payload)
          .then((res) => {
            localStorage.setItem('token', `Bearer ${res.data.accessToken}`)
            dispatch('getUserData')
            resolve(res)
          })
          .catch((e) => reject(e))
      })
    },

    signUp({ dispatch }, payload) {
      return new Promise((resolve, reject) => {
        api
          .post('/auth/registration', payload)
          .then(({ data }) => {
            localStorage.setItem('token', `Bearer ${data.accessToken}`)
            dispatch('getUserData')
            resolve(data)
          })
          .catch((e) => reject(e))
      })
    },
    async logOut({ commit }) {
      await userService.logout()
      localStorage.clear()
      commit('clearDirectories')
      commit('logOut')
      socket.disconnect()
      router.push('/auth/login')
    },

    getUserData({ commit, dispatch }) {
      return new Promise((resolve, _reject) => {
        commit('setAppLoading', true)
        api
          .get('/auth')
          .then((res) => {
            if (res?.data?.user) {
              commit('setUser', res.data.user)
              dispatch('setDirectories', res.data)
              socket.auth = { userId: res.data.user._id }
              socket.connect()
            } else dispatch('logOut')
            commit('setAppLoading', false)
            resolve(res)
          })
          .finally(() => {
            commit('setAppLoading', false)
          })
      })
    },
  },
  getters: {
    isLoggedIn: ({ user }) => !!user,
    token: ({ token }) => token,
    user: ({ user }) => user,

    userRoles: ({ user }, { myCompanies }) => {
      if (!user?.directoriesProfile) return []
      const currentCompany = myCompanies.find(
        (c) => c._id === user.directoriesProfile
      )
      return currentCompany?.roles || []
    },

    hasPermission:
      (state, { userRoles, permissionsMap }) =>
      (permission) => {
        if (userRoles.includes('admin')) return true
        return !!permissionsMap.get(permission)
      },

    allowedPeriodForPermission:
      (state, { permissionsMap }) =>
      ({ date, permission }) => {
        if (permissionsMap.has('fullAccess')) return true
        if (!permissionsMap.has(permission)) return false
        if (!date) return true
        if (permissionsMap.get(permission) === -1) return true
        const dayCount = Math.floor(
          (new Date() - new Date(date)) / (1000 * 60 * 60 * 24)
        )
        if (dayCount > permissionsMap.get(permission)) return false
        return true
      },

    directoriesProfile: ({ user }) => user?.directoriesProfile,
  },
}
