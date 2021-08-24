import Layout from '../pages/layout'
import orderRoutes from './orders'
import Schedule from '../pages/schedule'

export default [
  {
    path: '/orders',
    component: Layout,
    children: [...orderRoutes],
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/schedule',

    component: Layout,
    children: [
      {
        path: '/',
        name: 'Schedule',
        component: Schedule,
      },
    ],
    meta: {
      authRequired: true,
    },
  },
]
