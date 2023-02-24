import Layout from '../pages/layout'
import sararyTariffsRoutes from './salaryTariff.js'
import docsRegistryRouters from './docsRegistry.js'
import paymentInvoicesRoutes from '@/pages/accounting/paymentInvoice/routes'
export default [
  {
    path: '/accounting',
    component: Layout,
    children: [
      ...sararyTariffsRoutes,
      ...docsRegistryRouters,
      ...paymentInvoicesRoutes,
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
