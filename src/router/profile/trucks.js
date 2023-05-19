import TruckCreate from '@/pages/profile/truck/truckCreate'
import TruckList from '@/pages/profile/truck/truckList'
import TruckDetails from '@/pages/profile/truck/truckDetails'

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
