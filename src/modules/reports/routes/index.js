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
      {
        path: 'drivers_grades',
        name: 'DriversGrades',
        component: () => import('../pages/driversGrades'),
        meta: {
          permission: 'report:drivers_grades',
        },
      },
      {
        path: 'gross_profit',
        name: 'GrossProfit',
        component: () => import('../pages/grossProfitForPeriod'),
        meta: {
          permission: 'report:gross_profit',
        },
      },
      {
        path: 'gross_profit_pivot',
        name: 'GrossProfitPivot',
        component: () => import('../pages/grossProfitPivot'),
        meta: {
          permission: 'report:gross_profit',
        },
      },
      {
        path: 'order_docs',
        name: 'OrderDocsReport',
        component: () => import('../pages/orderDocs/orderDocs.page.vue'),
        meta: {
          permission: 'report:order_docs',
        },
      },
    ],
  },
]
