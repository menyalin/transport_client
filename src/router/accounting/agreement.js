const BASE_PATH = 'agreements'

export default [
  {
    path: BASE_PATH,
    name: 'AgreementList',
    component: () => import('@/pages/accounting/agreement/list'),
    meta: {
      permission: 'agreement:readList',
      title: 'Учет : Список соглашений',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'AgreementCreate',
    component: () => import('@/pages/accounting/agreement/details'),
    props: true,
    meta: {
      permission: 'agreement:readItem',
      title: 'Учет : Новое соглашение',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'AgreementDetails',
    component: () => import('@/pages/accounting/agreement/details'),
    props: true,
    meta: {
      permission: 'agreement:readItem',
      title: 'Учет : Соглашение',
    },
  },
]
