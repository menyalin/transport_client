import ZoneList from '@/pages/profile/zone/list.vue'
import ZoneDetails from '@/pages/profile/zone/details.vue'

const BASE_PATH = 'zones'

export default [
  {
    path: BASE_PATH,
    name: 'ZoneList',
    component: ZoneList,
    meta: {
      permission: 'zone:readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'ZoneCreate',
    component: ZoneDetails,
    props: true,
    meta: {
      permission: 'zone:readItem',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'ZoneDetails',
    component: ZoneDetails,
    props: true,
    meta: {
      permission: 'zone:readItem',
    },
  },
]