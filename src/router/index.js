import { createRouter, createWebHistory } from 'vue-router'

import store from '@/store'

import profileRoutes from './profile/index.js'
import accountingRoutes from './accounting/index.js'

import authRoutes from '@/modules/auth/auth.routes'
import adminRoutes from '@/router/admin.routes.js'
import orderRoutes from '@/router/orders/index.js'
import reportsRoutes from '@/router/reports.routes.js'

import serverNotAvailablePage from '@/pages/error.vue'
import HomeLayout from '@/pages/home.vue'
import AccessDeniedPage from '@/pages/accessDenied.vue'
import PermissionService from '@/shared/services/permission.service'
import TestVue3Page from '@/test-vue3.vue'

const _checkPermissions = (permissions, from) => {
  if (!permissions.length) return
  if (!PermissionService.check({ permissions })) {
    return {
      path: '/accessDenied',
      query: { redirect: from.fullPath || '/', message: 'Access is denied' },
    }
  }
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
    path: '/test-vue3',
    name: 'TestVue3',
    component: TestVue3Page,
  },
  {
    path: '/error',
    name: 'serverNotAvailable',
    component: serverNotAvailablePage,
  },
  {
    path: '/accessDenied',
    name: 'AccessDenied',
    component: AccessDeniedPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from) => {
  if (!!localStorage.getItem('token') && !store.getters.isLoggedIn)
    await store.dispatch('getUserData')

  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.title)

  if (nearestWithTitle) document.title = nearestWithTitle.meta.title
  else document.title = import.meta.env.VITE_APP_NAME || 's4log'

  const permissions = to.matched.map((r) => r.meta.permission).filter((p) => !!p)

  if (to.matched.some((record) => record.meta.authRequired && !store.getters.isLoggedIn))
    return {
      path: '/auth/login',
      query: { redirect: to.fullPath },
    }
  else if (store.getters.user && permissions.length) {
    const redirect = _checkPermissions(permissions, from)
    if (redirect) return redirect
  }
})

export default router
