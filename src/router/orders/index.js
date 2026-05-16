import Layout from '@/pages/orders/layout.vue'
import Schedule from '@/pages/orders/schedule.vue'
import orderRoutes from './orders'

export default [
  {
    path: '/schedule',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'Schedule',
        component: Schedule,
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
