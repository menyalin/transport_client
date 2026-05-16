import TruckCreate from '@/pages/profile/truck/truckCreate.vue'
import TruckList from '@/pages/profile/truck/truckList.vue'
import TruckDetails from '@/pages/profile/truck/truckDetails.vue'

export default [
  {
    path: 'trucks',
    name: 'TruckList',
    component: TruckList,
    meta: {
      permission: 'truck:readList',
    },
  },
  {
    path: 'trucks/create',
    name: 'TruckCreate',
    component: TruckCreate,
    meta: {
      permission: 'truck:readItem',
    },
  },
  {
    path: 'trucks/:id',
    name: 'TruckDetails',
    component: TruckDetails,
    props: true,
    meta: {
      permission: 'truck:readItem',
    },
  },
]
