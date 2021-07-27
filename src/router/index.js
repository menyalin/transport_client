import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store'

import authRoutes from '@/modules/auth/auth.routes'
import adminRoutes from '@/modules/admin/admin.routes'
import profileRoutes from '@/modules/profile/profile.routes/index.js'

import serverNotAvailablePage from '@/modules/common/pages/error'
import HomeLayout from '@/modules/common/pages/layout'

Vue.use(VueRouter)

const routes = [
  ...authRoutes,
  ...adminRoutes,
  ...profileRoutes,
  {
    path: '/',
    name: 'Home',
    component: HomeLayout,
  },
  {
    path: '/error',
    name: 'serverNotAvailable',
    component: serverNotAvailablePage,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  if (
    to.matched.some(
      (record) => record.meta.authRequired && !store.getters.isLoggedIn
    )
  ) {
    next({
      path: '/auth/login',
      query: { redirect: to.fullPath },
    })
  } else {
    next()
  }
})

export default router
