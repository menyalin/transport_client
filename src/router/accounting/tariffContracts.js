const BASE_PATH = 'tariff_contracts'

export default [
  // {
  //   path: BASE_PATH,
  //   name: 'DocumentList',
  //   component: () => import('@/pages/accounting/document/list'),
  //   meta: {
  //     permission: 'document:readList',
  //     title: 'Учет : Список документов',
  //   },
  // },
  {
    path: BASE_PATH + '/create',
    name: 'TariffCOntractCreate',
    component: () => import('@/pages/accounting/tariff_contract/details'),
    props: true,
    meta: {
      permission: 'tariffContract:readItem',
      title: 'Учет : Создание контракта',
    },
  },
  // {
  //   path: BASE_PATH + '/:id',
  //   name: 'DocumentDetails',
  //   component: () => import('@/pages/accounting/document/details'),
  //   props: true,
  //   meta: {
  //     permission: 'document:readItem',
  //     title: 'Учет : Документ',
  //   },
  // },
]
