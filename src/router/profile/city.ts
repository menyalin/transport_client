const BASE_PATH = 'cities'
const PERMISSION_ITEM_NAME = 'city'

export default [
  {
    path: BASE_PATH,
    name: 'CityList',
    component: () => import('@/pages/profile/city/list'),
    meta: {
      permission: PERMISSION_ITEM_NAME + ':readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'CityCreate',
    component: () => import('@/pages/profile/city/details'),
    props: true,
    meta: {
      permission: PERMISSION_ITEM_NAME + ':readItem',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'CityDetails',
    component: () => import('@/pages/profile/city/details'),
    props: true,
    meta: {
      permission: PERMISSION_ITEM_NAME + ':readItem',
    },
  },
]
