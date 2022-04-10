const BASE_PATH = 'tariffs'

export default [
  {
    path: BASE_PATH,
    name: 'TariffList',
    component: () => import('../pages/tariff/list'),
    meta: {
      permission: 'tariff:readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'TariffCreate',
    component: () => import('../pages/tariff/create'),
    props: true,
    meta: {
      permission: 'tariff:write',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'TariffDetails',
    component: () => import('../pages/tariff/details'),
    props: true,
    meta: {
      permission: 'tariff:readItem',
    },
  },
]
