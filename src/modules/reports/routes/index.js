import ReportLayout from '../pages/layout'
import CrewsReport from '../pages/crewsReport'
import DaysControl from '../pages/daysControl'

export default [
  {
    path: '/reports',
    component: ReportLayout,
    meta: {
      authRequired: true,
    },
    children: [
      { path: 'crews', name: 'CrewReport', component: CrewsReport },
      { path: 'daysControl', name: 'DaysControl', component: DaysControl },
    ],
  },
]
