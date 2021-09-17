import ReportLayout from '../pages/layout'
import CrewsReport from '../pages/crewsReport'

export default [
  {
    path: '/reports',
    component: ReportLayout,
    meta: {
      authRequired: true,
    },
    children: [{ path: 'crews', name: 'CrewReport', component: CrewsReport }],
  },
]
