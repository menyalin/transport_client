import ReportLayout from '@/pages/reports/layout'

export default [
  {
    path: '/reports',
    component: ReportLayout,
    meta: {
      title: 'Отчеты',
      authRequired: true,
    },
    children: [
      {
        path: 'crews',
        name: 'CrewReport',
        component: () => import('@/pages/reports/crewsReport'),
        meta: {
          title: 'Отчеты : Использование транспорта',
        },
      },
      {
        path: 'daysControl',
        name: 'DaysControl',
        component: () => import('@/pages/reports/daysControl'),
        meta: {
          title: 'Отчеты : Контроль сроков',
        },
      },
      {
        path: 'ordersInProgress',
        name: 'OrdersInProgress',
        component: () => import('@/pages/reports/ordersInProgress'),
        meta: {
          title: 'Отчеты : Простой транспорта',
        },
      },
      {
        path: 'truckStateOnDate',
        name: 'TruckStateOnDate',
        component: () => import('@/pages/reports/truckStateOnDate'),
        meta: {
          title: 'Отчеты : Статус транспорта на дату',
        },
      },
      {
        path: 'drivers_grades',
        name: 'DriversGrades',
        component: () => import('@/pages/reports/driversGrades'),
        meta: {
          title: 'Отчеты : Оценки водителей',
          permission: 'report:drivers_grades',
        },
      },

      {
        path: 'gross_profit_pivot',
        name: 'GrossProfitPivot',
        component: () => import('@/pages/reports/grossProfitPivot'),
        meta: {
          title: 'Отчеты : Валовая прибыль',
          permission: 'report:gross_profit',
        },
      },
      {
        path: 'order_docs',
        name: 'OrderDocsReport',
        component: () => import('@/pages/reports/orderDocs'),
        meta: {
          title: 'Отчеты : Документы',
          permission: 'report:orderDocs',
        },
      },
      {
        path: 'orders_wo_invoice',
        name: 'OrdersNotIncludedInInvoice',
        component: () => import('@/pages/reports/ordersWOInvoice'),
        meta: {
          title: 'Отчеты : Рейсы, не включенные в акты',
          permission: 'report:orderDocs',
        },
      },
    ],
  },
]
