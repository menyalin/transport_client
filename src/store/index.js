import { createStore } from 'vuex'
import ProfileModule from '@/store/profile/index.js'
import AuthModule from '@/modules/auth/auth.store'
import AccountingModule from '@/store/accounting/index.js'

export default createStore({
  state: () => ({
    tmpCacheMap: new Map(),
    loading: false,
    appLoading: false,
    error: null,
  }),
  mutations: {
    setAppLoading(state, payload) {
      state.appLoading = payload
    },
    setLoading(state, payload) {
      state.loading = payload
    },
    setError(state, payload) {
      if (payload?.response?.data?.message) state.error = payload.response.data.message
      else state.error = payload
    },
    clearError(state) {
      state.error = null
    },
    setStoredValue(state, payload) {
      state.tmpCacheMap.set(payload.name, payload.value)
    },
  },
  actions: {
    setError({ commit }, error) {
      commit('setError', error)
    },
  },
  getters: {
    error: ({ error }) => error,
    appLoading: ({ appLoading }) => appLoading,
    loading: ({ loading }) => loading,
    storedValue:
      ({ tmpCacheMap }) =>
      (name) =>
        tmpCacheMap.get(name),
  },
  modules: {
    AuthModule,
    ProfileModule,
    AccountingModule,
  },
})
