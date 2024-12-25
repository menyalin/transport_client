import Layout from '@/pages/profile/layout'

import crewRoutes from './crews.js'
import truckRoutes from './trucks.js'
import driverRoutes from './drivers.js'
import carrierRoutes from './carrier.js'
import partnerRoutes from './partners.js'
import addressRoutes from './address.js'
import downtimeRoutes from './downtime.js'
import ProfileSettings from '@/pages/profile/profileSettings'
import orderTemplateRoutes from './orderTemplates.js'
import scheduleNoteRoutes from './scheduleNotes.js'
import companyRouter from './company'
import zoneRouter from './zone'
import regionRouter from './region.js'
import cityRouter from './city.js'
import workerRouter from './worker.js'
import fineRouter from './fine.js'

export default [
  {
    path: '/profile',
    component: Layout,
    meta: {
      authRequired: true,
      title: 'Профиль',
    },
    children: [
      ...crewRoutes,
      ...truckRoutes,
      ...driverRoutes,
      ...carrierRoutes,
      ...partnerRoutes,
      ...addressRoutes,
      ...downtimeRoutes,
      ...orderTemplateRoutes,
      ...scheduleNoteRoutes,
      ...companyRouter,
      ...zoneRouter,
      ...regionRouter,
      ...cityRouter,
      ...workerRouter,
      ...fineRouter,

      /// Настройки профиля
      {
        path: 'settings',
        name: 'profileSettings',
        component: ProfileSettings,
      },
    ],
  },
]
