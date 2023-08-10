import Layout from '@/pages/accounting/layout'
import sararyTariffsRoutes from './salaryTariff.js'
import docsRegistryRoutes from './docsRegistry.js'
import paymentInvoicesRoutes from '@/pages/accounting/paymentInvoice/routes'
import tariffRoutes from './tariff'
export default [
  {
    path: '/accounting',
    component: Layout,
    children: [
      ...sararyTariffsRoutes,
      ...docsRegistryRoutes,
      ...paymentInvoicesRoutes,
      ...tariffRoutes,
      {
        path: 'driversSalary',
        name: 'DriversSalary',
        component: () => import('@/pages/accounting/salaryByPeriod/index.vue'),
      },
    ],
    meta: {
      authRequired: true,
    },
  },
]
