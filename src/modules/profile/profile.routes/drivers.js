import DriverCreate from '../pages/driver/driverCreate'
import DriverList from '../pages/driver/driverList'
import DriverDetails from '../pages/driver/driverDetails'

export default [
  {
    path: 'drivers',
    name: 'DriverList',
    component: DriverList,
    meta: {
      permission: 'driver:readList',
    },
  },
  {
    path: 'drivers/create',
    name: 'DriverCreate',
    component: DriverCreate,
    meta: {
      permission: 'driver:readItem',
    },
  },
  {
    path: 'drivers/:id',
    name: 'DriverDetails',
    component: DriverDetails,
    props: true,
    meta: {
      permission: 'driver:readItem',
    },
  },
]
