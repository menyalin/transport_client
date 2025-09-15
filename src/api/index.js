import axios from 'axios'
import z from 'zod'
import router from '@/router'
import store from '@/store'

function createApiInstance(props) {
  const propsSchema = z.object({
    baseURL: z.string(),
    withCredentials: z.boolean(),
    dispatchLogoutEvent: z.function(),
    moveToRootPage: z.function(),
  })

  const validatedProps = propsSchema.parse(props)

  const api = axios.create(validatedProps)
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
            `${import.meta.env.VITE_API_URL}/auth/refresh`,
            {},
            { withCredentials: true }
          )
          localStorage.setItem('token', `Bearer ${response?.data?.accessToken}`)
          return api.request(originalRequest)
        } catch (e) {
          console.log('error in refresh request')
          console.dir(e?.response)
          localStorage.removeItem('token')
          moveToRootPage()
        }
      } else if (error?.response?.status == 401 && error.config._isRetry) {
        console.log('api auth error')
        dispatchLogoutEvent()
        localStorage.removeItem('token')
      } else throw error
    }
  )
  return api
}

export default createApiInstance({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
  dispatchLogoutEvent: store.dispatch('logOut'),
  moveToRootPage: router.push('/'),
})
