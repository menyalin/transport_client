import Layout from '@/pages/profile/layout.vue'
import ProfileSettings from '@/pages/profile/profileSettings.vue'
import addressRoutes from './address'
import cityRouter from './city'
import companyRouter from './company'
import crewRoutes from './crews'
import downtimeRoutes from './downtime'
import driverRoutes from './drivers'
import fineRouter from './fine'
import orderTemplateRoutes from './orderTemplates'
import partnerRoutes from './partners'
import regionRouter from './region'
import scheduleNoteRoutes from './scheduleNotes'
import tkNameRoutes from './tkNames'
import truckRoutes from './trucks'
import workerRouter from './worker'
import zoneRouter from './zone'

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
      ...tkNameRoutes,
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
