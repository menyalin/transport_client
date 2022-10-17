import List from '../pages/salaryTariffs/list'
import Create from '../pages/salaryTariffs/create'

const BASE_PATH = 'salaryTariffs'

export default [
  {
    path: BASE_PATH,
    name: 'SalaryTariffList',
    component: List,
    meta: {
      permission: 'salaryTariff:readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'SalaryTariffCreate',
    component: Create,
    props: true,
    meta: {
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
