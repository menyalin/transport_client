const BASE_PATH = 'agreements'

export default [
  {
    path: BASE_PATH,
    name: 'AgreementList',
    component: () => import('../pages/agreement/list'),
    meta: {
      permission: 'agreement:readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'AgreementCreate',
    component: () => import('../pages/agreement/details'),
    props: true,
    meta: {
      permission: 'agreement:readItem',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'AgreementDetails',
    component: () => import('../pages/agreement/details'),
    props: true,
    meta: {
      permission: 'agreement:readItem',
    },
  },
]
