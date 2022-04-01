import axios from 'axios'
import store from '../store'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000/api',
})
api.interceptors.request.use(
  function (config) {
    if (store.getters.token) config.headers.Authorization = store.getters.token
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
api.interceptors.response.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
export default api
