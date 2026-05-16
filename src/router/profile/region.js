import RegionList from '@/pages/profile/region/list.vue'
import RegionDetails from '@/pages/profile/region/details.vue'

const BASE_PATH = 'regions'
const PERMISSION_ITEM_NAME = 'region'

export default [
  {
    path: BASE_PATH,
    name: 'RegionList',
    component: RegionList,
    meta: {
      permission: PERMISSION_ITEM_NAME + ':readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'RegionCreate',
    component: RegionDetails,
    props: true,
    meta: {
      permission: PERMISSION_ITEM_NAME + ':readItem',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'RegionDetails',
    component: RegionDetails,
    props: true,
    meta: {
      permission: PERMISSION_ITEM_NAME + ':readItem',
    },
  },
]
