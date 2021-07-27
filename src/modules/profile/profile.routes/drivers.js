import DriverCreate from '../pages/driver/driverCreate'
import DriverList from '../pages/driver/driverList'
import DriverDetails from '../pages/driver/driverDetails'

export default [
  {
    path: 'drivers',
    name: 'DriverList',
    component: DriverList,
  },
  {
    path: 'drivers/create',
    name: 'DriverCreate',
    component: DriverCreate,
  },
  {
    path: 'drivers/:id',
    name: 'DriverDetails',
    component: DriverDetails,
    props: true,
  },
]
