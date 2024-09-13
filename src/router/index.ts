//@ts-nocheck
import { createRouter, createWebHistory } from 'vue-router'

import authRoutes from '@/modules/auth/auth.routes'
import serverNotAvailablePage from '@/modules/common/pages/error.vue'
import HomeLayout from '@/modules/common/pages/layout.vue'
import orderRoutes from '@/modules/order/routes/index'
import adminRoutes from '@/router/admin.routes'
import reportsRoutes from '@/router/reports.routes'
import PermissionService from '@/shared/services/permission.service'
import store from '@/store'

import accountingRoutes from './accounting'
import profileRoutes from './profile'

const _checkPermissions = async (permissions: string[], next, to, from) => {
  if (!permissions.length) next()
  else if (!PermissionService.check({ permissions })) {
    next({
      path: '/accessDenied',
      query: { redirect: from.fullPath || '/', message: 'Access is denied' },
    })
  } else next()
}

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
    component: () => import('@/modules/common/pages/accessDenied.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
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
  else document.title = import.meta.env.VITE_NAME || 's4log'

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
