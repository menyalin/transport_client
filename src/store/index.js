import Vue from 'vue'
import Vuex from 'vuex'
import AuthModule from '@/modules/auth/auth.store'
import AdminModule from '@/modules/admin/admin.store'
import ProfileModule from '@/modules/profile/profile.store/index.js'
import OrderModule from '@/modules/order/store/index.js'
import AccountingModule from '@/modules/accounting/store.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: () => ({
    loading: false,
    appLoading: false,
    error: null,
    // baseUrl: process.env.VUE_APP_API_URL,
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
  },
  actions: {
    setError({ commit }, error) {
      commit('setError', error)
    },
  },
  getters: {
    // baseUrl: ({ baseUrl }) => baseUrl,
    error: ({ error }) => error,
    appLoading: ({ appLoading }) => appLoading,
    loading: ({ loading }) => loading,
  },
  modules: {
    AuthModule,
    AdminModule,
    ProfileModule,
    OrderModule,
    AccountingModule,
  },
  plugins: [
    // initPlugin
  ],
})
