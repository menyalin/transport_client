import ReportLayout from '@/pages/reports/layout.vue'
import CrewsReport from '@/pages/reports/crewsReport/index.vue'
import DaysControl from '@/pages/reports/daysControl/index.vue'
import OrdersInProgress from '@/pages/reports/ordersInProgress/index.vue'
import TruckStateOnDate from '@/pages/reports/truckStateOnDate/index.vue'
import DriversGrades from '@/pages/reports/driversGrades/index.vue'
import GrossProfitPivot from '@/pages/reports/grossProfitPivot/index.vue'
import OrderDocsReport from '@/pages/reports/orderDocs/index.vue'
import OrdersNotIncludedInInvoice from '@/pages/reports/ordersWOInvoice/index.vue'

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
        component: CrewsReport,
        meta: {
          title: 'Отчеты : Использование транспорта (будет удален)',
          permission: 'report:crew_diagram',
        },
      },
      {
        path: 'daysControl',
        name: 'DaysControl',
        component: DaysControl,
        meta: {
          title: 'Отчеты : Контроль сроков',
          permission: 'report:daysControl',
        },
      },
      {
        path: 'ordersInProgress',
        name: 'OrdersInProgress',
        component: OrdersInProgress,
        meta: {
          title: 'Отчеты : Простой транспорта (будет удален)',
          permission: 'report:inProgressOrders',
        },
      },
      {
        path: 'truckStateOnDate',
        name: 'TruckStateOnDate',
        component: TruckStateOnDate,
        meta: {
          title: 'Отчеты : Статус транспорта на дату',
          permission: 'report:truckStateOnDate',
        },
      },
      {
        path: 'drivers_grades',
        name: 'DriversGrades',
        component: DriversGrades,
        meta: {
          title: 'Отчеты : Оценки водителей',
          permission: 'report:driversGrades',
        },
      },

      {
        path: 'gross_profit_pivot',
        name: 'GrossProfitPivot',
        component: GrossProfitPivot,
        meta: {
          title: 'Отчеты : Валовая прибыль',
          permission: 'report:grossProfit',
        },
      },
      {
        path: 'order_docs',
        name: 'OrderDocsReport',
        component: OrderDocsReport,
        meta: {
          title: 'Отчеты : Документы',
          permission: 'report:orderDocs',
        },
      },
      {
        path: 'orders_wo_invoice',
        name: 'OrdersNotIncludedInInvoice',
        component: OrdersNotIncludedInInvoice,
        meta: {
          title: 'Отчеты : Рейсы, не включенные в акты',
          permission: 'report:ordersWOInvoice',
        },
      },
    ],
  },
]
