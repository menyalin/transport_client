import AgreementList from '@/pages/accounting/agreement/list.vue'
import AgreementDetails from '@/pages/accounting/agreement/details.vue'

const BASE_PATH = 'agreements'

export default [
  {
    path: BASE_PATH,
    name: 'AgreementList',
    component: AgreementList,
    meta: {
      permission: 'agreement:readList',
      title: 'Учет : Список соглашений',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'AgreementCreate',
    component: AgreementDetails,
    props: true,
    meta: {
      permission: 'agreement:readItem',
      title: 'Учет : Новое соглашение',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'AgreementDetails',
    component: AgreementDetails,
    props: true,
    meta: {
      permission: 'agreement:readItem',
      title: 'Учет : Соглашение',
    },
  },
]
