import List from '@/pages/accounting/salaryTariffs/list'
import Create from '@/pages/accounting/salaryTariffs/create'

const BASE_PATH = 'salaryTariffs'

export default [
  {
    path: BASE_PATH,
    name: 'SalaryTariffList',
    component: List,
    meta: {
      title: 'Учет : Зарплатные тарифы',
      permission: 'salaryTariff:readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'SalaryTariffCreate',
    component: Create,
    props: true,
    meta: {
      title: 'Учет :  Новый тариф',
      permission: 'salaryTariff:write',
    },
  },
  // {
  //   path: BASE_PATH + '/:id',
  //   name: 'SalaryTariffDetails',
  //   component: Details,
  //   props: true,
  //   meta: {
  //     permission: 'salaryTariff:readItem',
  //   },
  // },
]
