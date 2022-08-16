import api from '@/api'
import router from '@/router'
import socket from '@/socket'

export default {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
  }),
  mutations: {
    clearDirectoriesProfile(state) {
      state.user.directoriesProfile = null
    },
    setToken(state, payload) {
      state.token = payload
      localStorage.setItem('token', payload)
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
    signUp({ commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        api
          .post('/auth/registration', payload)
          .then(({ data }) => {
            commit('setToken', data.token)
            dispatch('getUserData')
            resolve(data)
          })
          .catch((e) => reject(e))
      })
    },
    logOut({ commit }) {
      localStorage.clear()
      commit('logOut')
      socket.disconnect()
      router.push('/auth/login')
    },
    getUserData({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        commit('setAppLoading', true)
        api
          .get('/auth')
          .then((res) => {
            if (res.data.user) {
              commit('setUser', res.data.user)
              dispatch('setDirectories', res.data)
              socket.auth = { userId: res.data.user._id }
              socket.connect()
            } else dispatch('logOut')
            commit('setAppLoading', false)
            resolve(res)
          })
          .catch((e) => {
            if (e.response?.status === 401) dispatch('logOut')
            commit('setAppLoading', false)
            reject(e)
          })
      })
    },
    signIn({ commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        api
          .post('/auth/login', payload)
          .then((res) => {
            commit('setToken', res.data.token)
            dispatch('getUserData')
            resolve(res)
          })
          .catch((e) => reject(e))
      })
    },
  },
  getters: {
    isLoggedIn: ({ token }) => !!token,
    token: ({ token }) => token,
    user: ({ user }) => user,

    userRoles: ({ user }, { myCompanies }) => {
      if (!user?.directoriesProfile) return []
      const currentCompany = myCompanies.find(
        (c) => c._id === user.directoriesProfile
      )
      if (!currentCompany) return []
      const emp = currentCompany.staff.find(
        (employee) => employee.user._id === user._id
      )
      return emp.roles || []
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
