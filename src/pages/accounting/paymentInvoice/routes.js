const BASE_PATH = 'paymentInvoice'

export default [
  {
    path: BASE_PATH,
    name: 'PaymentInvoiceList',
    component: () => import('./list.vue'),
    meta: {
      permission: 'paymentInvoice:readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'PaymentInvoiceCreate',
    component: () => import('./details.vue'),
    props: true,
    meta: {
      permission: 'paymentInvoice:write',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'PaymentInvoiceDetail',
    component: () => import('./details.vue'),
    props: true,
    meta: {
      permission: 'paymentInvoice:readItem',
    },
  },
]
