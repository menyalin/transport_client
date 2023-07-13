import router from '@/router/index'
import store from '@/store/index'
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
})

api.interceptors.request.use(
  function (config) {
    config.headers.Authorization = localStorage.getItem('token')
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
  async (error) => {
    const originalRequest = error.config
    if (
      error?.response?.status == 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        )
        localStorage.setItem('token', `Bearer ${response?.data?.accessToken}`)
        return api.request(originalRequest)
      } catch (e) {
        console.log('error in refresh request')
        console.dir(e?.response)
        localStorage.removeItem('token')
        router.push('/')
      }
    } else if (error?.response?.status == 401 && error.config._isRetry) {
      console.log('api auth error')
      store.dispatch('logOut')
      localStorage.removeItem('token')
    } else throw error
  }
)
export default api
