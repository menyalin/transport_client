import Layout from '../pages/layout'
import Companies from '../pages/companyList'
import CompanyEdit from '../pages/companyEdit'
import CompanyDetails from '../pages/companyDetails'
import TaskList from '../pages/taskList'

import AddressCreate from '../pages/address/addressCreate'
import AddressList from '../pages/address/addressList'
import AddressDetails from '../pages/address/addressDetails'

import routeSheetRoutes from './routeSheets'
import truckRoutes from './trucks'
import driverRoutes from './drivers'

import ProfileSettings from '../pages/profileSettings'

export default [
  {
    path: '/profile',
    component: Layout,
    meta: {
      authRequired: true,
    },
    children: [
      ...routeSheetRoutes,
      ...truckRoutes,
      ...driverRoutes,
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
      /// Настройки профиля
      {
        path: 'settings',
        name: 'profileSettings',
        component: ProfileSettings,
      },
    ],
  },
]
