import Layout from '../pages/layout'

export default [
  {
    path: '/accounting',
    component: Layout,
    children: [
      {
        path: 'driversSalary',
        name: 'DriversSalary',
        component: () => import('@/modules/accounting/pages/salary/index.vue'),
      },
    ],
    meta: {
      authRequired: true,
    },
  },
]
