const BASE_PATH = 'zones'

export default [
  {
    path: BASE_PATH,
    name: 'ZoneList',
    component: () => import('@/pages/profile/zone/list'),
    meta: {
      permission: 'zone:readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'ZoneCreate',
    component: () => import('@/pages/profile/zone/details'),
    props: true,
    meta: {
      permission: 'zone:readItem',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'ZoneDetails',
    component: () => import('@/pages/profile/zone/details'),
    props: true,
    meta: {
      permission: 'zone:readItem',
    },
  },
]
