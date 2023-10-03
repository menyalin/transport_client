const BASE_PATH = 'tariffs'

export default [
  {
    path: BASE_PATH,
    name: 'TariffList',
    component: () => import('@/pages/profile/tariff/list'),
    meta: {
      permission: 'tariff:readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'TariffCreate',
    component: () => import('@/pages/profile/tariff/create'),
    props: true,
    meta: {
      permission: 'tariff:write',
    },
  },
]
