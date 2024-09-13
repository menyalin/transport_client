const BASE_PATH = 'tariff_contracts'

export default [
  {
    path: BASE_PATH,
    name: 'TariffContractList',
    component: () => import('@/pages/accounting/tariff_contract/list'),
    meta: {
      permission: 'tariffContract:readList',
      title: 'Учет : Список контрактов',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'TariffContractCreate',
    component: () => import('@/pages/accounting/tariff_contract/details'),
    props: true,
    meta: {
      permission: 'tariffContract:readItem',
      title: 'Учет : Создание контракта',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'TariffContractDetails',
    component: () => import('@/pages/accounting/tariff_contract/details'),
    props: true,
    meta: {
      permission: 'tariffContract:readItem',
      title: 'Учет : Контракт',
    },
  },
]
