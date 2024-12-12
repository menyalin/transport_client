const BASE_PATH = 'incomingInvoice'

export default [
  {
    path: BASE_PATH,
    name: 'IncomingInvoiceList',
    component: () => import('./list.vue'),
    meta: {
      title: 'Входящие акты',
      permission: 'incomingInvoice:readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'IncomingInvoiceCreate',
    component: () => import('./details.vue'),
    props: true,
    meta: {
      title: 'Новый входящий акт',
      permission: 'incomingInvoice:write',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'IncomingInvoiceDetail',
    component: () => import('./details.vue'),
    props: true,
    meta: {
      title: 'Входящий акт',
      permission: 'incomingInvoice:readItem',
    },
  },
  {
    path: BASE_PATH + '/:invoiceId/pickOrders/:agreementId/:carrierId',
    name: 'PickOrdersForIncomingInvoice',
    component: () => import('./pickOrders.vue'),
    props: true,
    meta: {
      title: 'Подбор рейсов для входящешл акта',
      permission: 'incomingInvoice:write',
    },
  },
]
