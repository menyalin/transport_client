import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store'

import profileRoutes from './profile/index.js'
import accountingRoutes from './accounting/index.js'

import authRoutes from '@/modules/auth/auth.routes'
import adminRoutes from '@/router/admin.routes.js'
import orderRoutes from '@/router/orders/index.js'
import reportsRoutes from '@/router/reports.routes.js'

import serverNotAvailablePage from '@/modules/common/pages/error.vue'
import HomeLayout from '@/modules/common/pages/layout.vue'
import PermissionService from '@/shared/services/permission.service'

const _checkPermissions = async (permissions, next, _to, from) => {
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

  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.title)

  if (nearestWithTitle) document.title = nearestWithTitle.meta.title
  else document.title = import.meta.env.VITE_APP_NAME || 's4log'

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
  else if (store.getters.user && permissions.length)
    _checkPermissions(permissions, next, to, from)
  else next()
})

export default router
