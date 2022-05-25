const BASE_PATH = 'regions'
const PERMISSION_ITEM_NAME = 'region'

export default [
  {
    path: BASE_PATH,
    name: 'RegionList',
    component: () => import('../pages/region/list'),
    meta: {
      permission: PERMISSION_ITEM_NAME + ':readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'RegionCreate',
    component: () => import('../pages/region/details'),
    props: true,
    meta: {
      permission: PERMISSION_ITEM_NAME + ':readItem',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'RegionDetails',
    component: () => import('../pages/region/details'),
    props: true,
    meta: {
      permission: PERMISSION_ITEM_NAME + ':readItem',
    },
  },
]
