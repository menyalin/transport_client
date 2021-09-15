import ReportLayout from '../pages/layout.vue'
import CrewsReport from '../pages/crewsReport.vue'

export default [
  {
    path: '/reports',
    component: ReportLayout,
    meta: {
      authRequired: true,
    },
    children: [{ path: '/crews', name: "CrewReport", component: CrewsReport }],
  },
]
