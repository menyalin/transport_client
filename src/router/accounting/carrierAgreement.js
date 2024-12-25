const BASE_PATH = 'carrierAgreements'

export default [
  {
    path: BASE_PATH,
    name: 'CarrierAgreementList',
    component: () => import('@/pages/accounting/carrierAgreement/list'),
    meta: {
      permission: 'carrierAgreement:readList',
      title: 'Учет : Список соглашений c ТК',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'CarrierAgreementCreate',
    props: true,
    component: () => import('@/pages/accounting/carrierAgreement/details'),
    meta: {
      permission: 'carrierAgreement:readItem',
      title: 'Учет : Новое соглашение c ТК',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'CarrierAgreementDetails',
    component: () => import('@/pages/accounting/carrierAgreement/details'),
    props: true,
    meta: {
      permission: 'carrierAgreement:readItem',
      title: 'Учет : Соглашение с ТК',
    },
  },
]
