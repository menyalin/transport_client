import Layout from '@/pages/accounting/layout'
import sararyTariffsRoutes from './salaryTariff.js'
import agreementRoutes from './agreement.js'
import documentRoutes from './document.js'
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
      ...agreementRoutes,
      ...documentRoutes,
      {
        path: 'driversSalary',
        name: 'DriversSalary',
        component: () => import('@/pages/accounting/salaryByPeriod/index.vue'),
        meta: { title: 'ЗП Водителей' },
      },
    ],
    meta: {
      title: 'Блок учета',
      authRequired: true,
    },
  },
]
