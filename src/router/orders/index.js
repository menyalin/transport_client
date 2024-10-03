import Layout from '@/pages/orders/layout'
import orderRoutes from './orders'

export default [
  {
    path: '/schedule',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'Schedule',
        component: () => import('@/pages/orders/schedule'),
        meta: { title: 'Распределение' },
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
      title: 'Рейсы',
    },
  },
]
