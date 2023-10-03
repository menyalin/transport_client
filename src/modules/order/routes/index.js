import Layout from '../pages/layout'
import orderRoutes from './orders'

export default [
  {
    path: '/schedule',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'Schedule',
        component: () => import('../pages/schedule'),
      },
    ],
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/orders',
    component: Layout,
    children: [...orderRoutes],
    meta: {
      authRequired: true,
    },
  },
]
