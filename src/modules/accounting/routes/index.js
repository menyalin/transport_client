import Layout from '../pages/layout'
import sararyTariffsRoutes from './salaryTariff.js'
import docsRegistryRouters from './docsRegistry.js'

export default [
  {
    path: '/accounting',
    component: Layout,
    children: [
      ...sararyTariffsRoutes,
      ...docsRegistryRouters,
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
