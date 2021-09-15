import ReportLayout from '../pages/layout.vue'
import CrewsReport from '../pages/crewsReport.vue'

export default [
  {
    path: '/reports',
    component: ReportLayout,
    childrens: [{ path: '/crews', component: CrewsReport }],
  },
]
