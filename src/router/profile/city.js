import CityList from '@/pages/profile/city/list.vue'
import CityDetails from '@/pages/profile/city/details.vue'

const BASE_PATH = 'cities'
const PERMISSION_ITEM_NAME = 'city'

export default [
  {
    path: BASE_PATH,
    name: 'CityList',
    component: CityList,
    meta: {
      permission: PERMISSION_ITEM_NAME + ':readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'CityCreate',
    component: CityDetails,
    props: true,
    meta: {
      permission: PERMISSION_ITEM_NAME + ':readItem',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'CityDetails',
    component: CityDetails,
    props: true,
    meta: {
      permission: PERMISSION_ITEM_NAME + ':readItem',
    },
  },
]
