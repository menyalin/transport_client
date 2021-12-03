import api from '@/api'
import router from '@/router'
import socket from '@/socket'

export default {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
  }),
  mutations: {
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
      localStorage.removeItem('token')
      commit('logOut')
      socket.disconnect()
      router.push('/auth/login')
    },
    getUserData({ commit, dispatch, getters }) {
      return new Promise((resolve, reject) => {
        api
          .get('/auth')
          .then((res) => {
            if (res.data.user) {
              commit('setUser', res.data.user)
              dispatch('setDirectories', res.data)
            } else dispatch('logOut')
            socket.auth = { userId: res.data.user._id }
            socket.connect()
            resolve(res)
          })
          .catch((e) => {
            if (e.response?.status === 401) dispatch('logOut')
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
    directoriesProfile: ({ user }) => user?.directoriesProfile,
  },
}
