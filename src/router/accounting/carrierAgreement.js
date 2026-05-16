import CarrierAgreementList from '@/pages/accounting/carrierAgreement/list.vue'
import CarrierAgreementDetails from '@/pages/accounting/carrierAgreement/details.vue'

const BASE_PATH = 'carrierAgreements'

export default [
  {
    path: BASE_PATH,
    name: 'CarrierAgreementList',
    component: CarrierAgreementList,
    meta: {
      permission: 'carrierAgreement:readList',
      title: 'Учет : Список соглашений c ТК',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'CarrierAgreementCreate',
    props: true,
    component: CarrierAgreementDetails,
    meta: {
      permission: 'carrierAgreement:readItem',
      title: 'Учет : Новое соглашение c ТК',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'CarrierAgreementDetails',
    component: CarrierAgreementDetails,
    props: true,
    meta: {
      permission: 'carrierAgreement:readItem',
      title: 'Учет : Соглашение с ТК',
    },
  },
]
