import Layout from '@/pages/accounting/layout'
import sararyTariffsRoutes from './salaryTariff.js'
import agreementRoutes from './agreement.js'
import docsRegistryRoutes from './docsRegistry.js'
import paymentInvoicesRoutes from '@/pages/accounting/paymentInvoice/routes'
import incomingInvoicesRoutes from '@/pages/accounting/incomingInvoice/routes'
import tariffContractsRoutes from './tariffContracts.js'
import carrierAgreementRoutes from './carrierAgreement.js'

export default [
  {
    path: '/accounting',
    component: Layout,
    children: [
      ...sararyTariffsRoutes,
      ...docsRegistryRoutes,
      ...paymentInvoicesRoutes,
      ...incomingInvoicesRoutes,
      ...agreementRoutes,
      ...tariffContractsRoutes,
      ...carrierAgreementRoutes,
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
