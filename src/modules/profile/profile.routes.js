import Layout from './pages/layout'
import Companies from './pages/companyList'
import CompanyEdit from './pages/companyEdit'
import CompanyDetails from './pages/companyDetails'
import TaskList from './pages/taskList'

import AddressCreate from './pages/address/addressCreate'
import AddressList from './pages/address/addressList'
import AddressDetails from './pages/address/addressDetails'

import DriverCreate from './pages/driver/driverCreate'
import DriverList from './pages/driver/driverList'
import DriverDetails from './pages/driver/driverDetails'

import TruckCreate from './pages/truck/truckCreate'
import TruckList from './pages/truck/truckList'
import TruckDetails from './pages/truck/truckDetails'

import ProfileSettings from './pages/profileSettings'

export default [
  {
    path: '/profile',
    component: Layout,
    meta: {
      authRequired: true,
    },
    children: [
      { path: 'companies', name: 'companyList', component: Companies },
      {
        path: 'companies/create',
        name: 'createNewCompany',
        component: CompanyEdit,
      },
      {
        path: 'companies/:id',
        name: 'companyDetails',
        component: CompanyDetails,
        props: true,
      },
      { path: 'tasks', name: 'taskList', component: TaskList },

      {
        path: 'address',
        name: 'AddressList',
        component: AddressList,
      },
      {
        path: 'address/create',
        name: 'createAddress',
        component: AddressCreate,
      },
      {
        path: 'address/:id',
        name: 'addressDetails',
        component: AddressDetails,
        props: true,
      },
      /// Driver
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
      /// TRUCK
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

      /// Настройки профиля
      {
        path: 'settings',
        name: 'profileSettings',
        component: ProfileSettings,
      },
    ],
  },
]
