import Layout from '../pages/layout'
import sararyTariffsRoutes from './salaryTariff.js'

export default [
  {
    path: '/accounting',
    component: Layout,
    children: [
      ...sararyTariffsRoutes,
      {
        path: 'driversSalary',
        name: 'DriversSalary',
        component: () =>
          import('@/modules/accounting/pages/salaryByPeriod/index.vue'),
      },
    ],
    meta: {
      authRequired: true,
    },
  },
]
