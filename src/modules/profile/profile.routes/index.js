import Layout from '../pages/layout'
import Companies from '../pages/companyList'
import CompanyEdit from '../pages/companyEdit'
import CompanyDetails from '../pages/companyDetails'
import TaskList from '../pages/taskList'


import crewRoutes from './crews'
import truckRoutes from './trucks'
import driverRoutes from './drivers'
import tkNameRoutes from './tkNames'
import partnerRoutes from './partners'
import addressRoutes from './address'

import ProfileSettings from '../pages/profileSettings'

export default [
  {
    path: '/profile',
    component: Layout,
    meta: {
      authRequired: true,
    },
    children: [
      ...crewRoutes,
      ...truckRoutes,
      ...driverRoutes,
      ...tkNameRoutes,
      ...partnerRoutes,
      ...addressRoutes,
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

      
      /// Настройки профиля
      {
        path: 'settings',
        name: 'profileSettings',
        component: ProfileSettings,
      },
    ],
  },
]
