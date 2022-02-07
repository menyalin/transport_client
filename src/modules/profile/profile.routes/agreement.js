const BASE_PATH = 'agreements'

export default [
  {
    path: BASE_PATH,
    name: 'AgreementList',
    component: () => import('../pages/agreement/list'),
  },
  {
    path: BASE_PATH + '/create',
    name: 'AgreementCreate',
    component: () => import('../pages/agreement/details'),
    props: true,
  },
  {
    path: BASE_PATH + '/:id',
    name: 'AgreementDetails',
    component: () => import('../pages/agreement/details'),
    props: true,
  },
]
