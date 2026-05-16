import Layout from '@/pages/accounting/layout.vue'
import DriversSalary from '@/pages/accounting/salaryByPeriod/index.vue'
import sararyTariffsRoutes from './salaryTariff.js'
import agreementRoutes from './agreement.js'
import docsRegistryRoutes from './docsRegistry.js'
import paymentInvoicesRoutes from '@/pages/accounting/paymentInvoice/routes.js'
import incomingInvoicesRoutes from '@/pages/accounting/incomingInvoice/routes.js'
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
        component: DriversSalary,
        meta: { title: 'Учет : ЗП Водителей' },
      },
    ],
    meta: {
      title: 'Учет',
      authRequired: true,
    },
  },
]
