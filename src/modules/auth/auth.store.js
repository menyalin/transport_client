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
    getUserData({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        api
          .get('/auth')
          .then((res) => {
            if (res.data.data) {
              commit('setUser', res.data.data)
            } else dispatch('logOut')
            socket.auth = { userId: res.data.data._id }
            socket.connect()
            resolve(res)
          })
          .catch((e) => {
            if (e.response?.status === 401) dispatch('logOut')
            console.log(e)
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
  },
}
