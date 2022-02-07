import Layout from '../pages/layout'
import Companies from '../pages/companyList'
import CompanyEdit from '../pages/companyEdit'
import CompanyDetails from '../pages/companyDetails'
import TaskList from '../pages/taskList'

import crewRoutes from './crews.js'
import truckRoutes from './trucks.js'
import driverRoutes from './drivers.js'
import tkNameRoutes from './tkNames.js'
import partnerRoutes from './partners.js'
import addressRoutes from './address.js'
import downtimeRoutes from './downtime.js'
import ProfileSettings from '../pages/profileSettings'
import orderTemplateRoutes from './orderTemplates.js'
import scheduleNoteRoutes from './scheduleNotes.js'
import agreementRoutes from './agreement'

export default [
  {
    path: '/profile',
    component: Layout,
    meta: {
      authRequired: true,
    },
    children: [
      ...agreementRoutes,
      ...crewRoutes,
      ...truckRoutes,
      ...driverRoutes,
      ...tkNameRoutes,
      ...partnerRoutes,
      ...addressRoutes,
      ...downtimeRoutes,
      ...orderTemplateRoutes,
      ...scheduleNoteRoutes,
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
