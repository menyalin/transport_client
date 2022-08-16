import Layout from '../pages/layout'
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
import companyRouter from './company'
import tariffRouter from './tariff'
import documentRouter from './document'
import zoneRouter from './zone'
import regionRouter from './region.js'
import cityRouter from './city.js'
import workerRouter from './worker.js'

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
      ...companyRouter,
      ...tariffRouter,
      ...documentRouter,
      ...zoneRouter,
      ...regionRouter,
      ...cityRouter,
      ...workerRouter,
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
