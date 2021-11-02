import Vue from 'vue'
import Vuex from 'vuex'
import AuthModule from '@/modules/auth/auth.store'
import AdminModule from '@/modules/admin/admin.store'
import ProfileModule from '@/modules/profile/profile.store/index.js'
import OrderModule from '@/modules/order/store/index.js'
import router from '../router'

const initPlugin = (store) => {
  if (store.getters.token) {
    store.state.appLoading = true
    Promise.all([store.dispatch('getUserData')])
      .catch((e) => {
        router.push({
          name: 'serverNotAvailable',
          query: { message: e.message },
        })
      })
      .finally(() => {
        store.state.appLoading = false
      })
  }
}

Vue.use(Vuex)

export default new Vuex.Store({
  state: () => ({
    loading: false,
    appLoading: false,
    error: null,
    baseUrl: process.env.VUE_APP_API_URL,
    formCacheMap: new Map(),
  }),
  mutations: {
    setAppLoading(state, payload) {
      state.appLoading = payload
    },
    setLoading(state, payload) {
      state.loading = payload
    },
    setError(state, payload) {
      if (payload?.response?.data?.message)
        state.error = payload.response.data.message
      else state.error = payload
    },
    clearError(state) {
      state.error = null
    },
    addFormToCache({ formCacheMap }, { key, form }) {
      formCacheMap.set(key, form)
    },
    deleteFormCache({ formCacheMap }, formName) {
      formCacheMap.delete(formName)
    },
    updateFormCache({ formCacheMap }, { formName, fieldName, value }) {
      let cache = formCacheMap.get(formName)
      cache = { ...cache, [fieldName]: value }
      formCacheMap.set(formName, cache)
    },
  },
  actions: {
    setError({ commit }, error) {
      commit('setError', error)
    },
  },
  getters: {
    baseUrl: ({ baseUrl }) => baseUrl,
    error: ({ error }) => error,
    appLoading: ({ appLoading }) => appLoading,
    loading: ({ loading }) => loading,
    formCacheMap: ({ formCacheMap }) => formCacheMap,
  },
  modules: { AuthModule, AdminModule, ProfileModule, OrderModule },
  plugins: [initPlugin],
})
