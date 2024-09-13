import Layout from '@/pages/accounting/layout.vue'
import paymentInvoicesRoutes from '@/pages/accounting/paymentInvoice/routes'

import agreementRoutes from './agreement'
import docsRegistryRoutes from './docsRegistry'
import sararyTariffsRoutes from './salaryTariff'
import tariffContractsRoutes from './tariffContracts'

export default [
  {
    path: '/accounting',
    component: Layout,
    children: [
      ...sararyTariffsRoutes,
      ...docsRegistryRoutes,
      ...paymentInvoicesRoutes,
      ...agreementRoutes,
      ...tariffContractsRoutes,

      {
        path: 'driversSalary',
        name: 'DriversSalary',
        component: () => import('@/pages/accounting/salaryByPeriod/index.vue'),
        meta: { title: 'Учет : ЗП Водителей' },
      },
    ],
    meta: {
      title: 'Учет',
      authRequired: true,
    },
  },
]
