import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store'

import authRoutes from '@/modules/auth/auth.routes'
import adminRoutes from '@/modules/admin/admin.routes'
import profileRoutes from '@/modules/profile/profile.routes/index.js'
import orderRoutes from '@/modules/order/routes/index.js'
import reportsRoutes from '@/modules/reports/routes/index.js'
import accountingRoutes from '@/modules/accounting/routes/index.js'

import serverNotAvailablePage from '@/modules/common/pages/error'
import HomeLayout from '@/modules/common/pages/layout'
import PermissionService from '@/modules/common/services/permission.service'

const _checkPermissions = (permissions, next, to, from) => {
  if (permissions.length && !PermissionService.check({ permissions })) {
    next({
      path: '/accessDenied',
      query: { redirect: from.fullPath, message: 'Access is denied' },
    })
  }
  next()
}

Vue.use(VueRouter)

const routes = [
  ...authRoutes,
  ...adminRoutes,
  ...profileRoutes,
  ...orderRoutes,
  ...reportsRoutes,
  ...accountingRoutes,
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
  {
    path: '/accessDenied',
    name: 'AccessDenied',
    component: () => import('@/modules/common/pages/accessDenied'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  const permissions = to.matched
    .map((r) => r.meta.permission)
    .filter((p) => !!p)

  if (
    to.matched.some(
      (record) => record.meta.authRequired && !store.getters.isLoggedIn
    )
  )
    next({
      path: '/auth/login',
      query: { redirect: to.fullPath },
    })

  if (!store.getters.user && store.getters.isLoggedIn) {
    store.state.appLoading = true
    store
      .dispatch('getUserData')
      .then(_checkPermissions(permissions, next, to, from))
      .catch((e) => {
        next({
          name: 'serverNotAvailable',
          query: { message: e.message },
        })
      })
      .finally(() => {
        store.state.appLoading = false
      })
  } else if (store.getters.user && store.getters.isLoggedIn)
    _checkPermissions(permissions, next, to, from)

  next()
})

export default router
