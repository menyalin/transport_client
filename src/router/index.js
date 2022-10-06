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

const _checkPermissions = async (permissions, next, to, from) => {
  if (!permissions.length) next()
  else if (!PermissionService.check({ permissions })) {
    next({
      path: '/accessDenied',
      query: { redirect: from.fullPath || '/', message: 'Access is denied' },
    })
  } else next()
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

router.beforeEach(async (to, from, next) => {
  if (!!localStorage.getItem('token') && !store.getters.isLoggedIn)
    await store.dispatch('getUserData')

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
  // else if (store.getters.isLoggedIn && !store.getters.user) {
  //   store
  //     .dispatch('getUserData')
  //     .then(() => {
  //       _checkPermissions(permissions, next, to, from)
  //     })
  //     .catch((e) => {
  //       next({
  //         name: 'serverNotAvailable',
  //         query: { message: e.message },
  //       })
  //     })
  //  }
  else if (store.getters.user && permissions.length)
    _checkPermissions(permissions, next, to, from)
  else next()
})

export default router
