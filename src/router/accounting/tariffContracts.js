import TariffContractList from '@/pages/accounting/tariff_contract/list.vue'
import TariffContractDetails from '@/pages/accounting/tariff_contract/details.vue'

const BASE_PATH = 'tariff_contracts'

export default [
  {
    path: BASE_PATH,
    name: 'TariffContractList',
    component: TariffContractList,
    meta: {
      permission: 'tariffContract:readList',
      title: 'Учет : Список контрактов',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'TariffContractCreate',
    component: TariffContractDetails,
    props: true,
    meta: {
      permission: 'tariffContract:readItem',
      title: 'Учет : Создание контракта',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'TariffContractDetails',
    component: TariffContractDetails,
    props: true,
    meta: {
      permission: 'tariffContract:readItem',
      title: 'Учет : Контракт',
    },
  },
]
