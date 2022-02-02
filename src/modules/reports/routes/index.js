import ReportLayout from '../pages/layout'

export default [
  {
    path: '/reports',
    component: ReportLayout,
    meta: {
      authRequired: true,
    },
    children: [
      {
        path: 'crews',
        name: 'CrewReport',
        component: () => import('../pages/crewsReport'),
      },
      {
        path: 'daysControl',
        name: 'DaysControl',
        component: () => import('../pages/daysControl'),
      },
      {
        path: 'ordersInProgress',
        name: 'OrdersInProgress',
        component: () => import('../pages/ordersInProgress'),
      },
      {
        path: 'truckStateOnDate',
        name: 'TruckStateOnDate',
        component: () => import('../pages/truckStateOnDate'),
      },
    ],
  },
]
