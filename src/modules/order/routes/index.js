import Layout from '../pages/layout'
import orderRoutes from './orders'

export default [
  {
    path: '/orders',
    component: Layout,
    children: [...orderRoutes],
    meta: {
      authRequired: true,
    },
  },
]
