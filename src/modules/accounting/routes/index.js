import Layout from '../pages/layout'

export default [
  {
    path: '/accounting',
    component: Layout,
    children: [
      {
        path: 'orders',
        name: 'OrdersListAccounting',
        component: () => import('@/modules/accounting/pages/orders/list.vue'),
      },
    ],
    meta: {
      authRequired: true,
    },
  },
]
