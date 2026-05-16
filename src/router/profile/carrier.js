import TkNameCreate from '@/pages/profile/carrier/create.vue'
import TkNameList from '@/pages/profile/carrier/list.vue'
import TkNameDetails from '@/pages/profile/carrier/details.vue'
const BASE_PATH = 'carriers'

export default [
  {
    path: BASE_PATH,
    name: 'CarrierList',
    component: TkNameList,
    meta: {
      permission: 'carrier:readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'CarrierCreate',
    component: TkNameCreate,
    meta: {
      permission: 'carrier:readItem',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'CarrierDetails',
    component: TkNameDetails,
    props: true,
    meta: {
      permission: 'carrier:readItem',
    },
  },
]
