import TruckCreate from '../pages/truck/truckCreate'
import TruckList from '../pages/truck/truckList'
import TruckDetails from '../pages/truck/truckDetails'

export default [
  {
    path: 'trucks',
    name: 'TruckList',
    component: TruckList,
  },
  {
    path: 'trucks/create',
    name: 'TruckCreate',
    component: TruckCreate,
  },
  {
    path: 'trucks/:id',
    name: 'TruckDetails',
    component: TruckDetails,
    props: true,
  },
]
