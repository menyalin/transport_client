import DriverCreate from '@/pages/profile/driver/driverCreate'
import DriverList from '@/pages/profile/driver/driverList'
import DriverDetails from '@/pages/profile/driver/driverDetails'

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
