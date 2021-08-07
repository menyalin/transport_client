import CrewCreate from '../pages/crew/crewCreate'
import CrewList from '../pages/crew/crewList'
import CrewDetails from '../pages/crew/crewDetails'
const BASE_PATH = 'crews'

export default [
  {
    path: BASE_PATH,
    name: 'CrewList',
    component: CrewList,
  },
  {
    path: BASE_PATH + '/create',
    name: 'CrewCreate',
    component: CrewCreate,
  },
  {
    path: BASE_PATH + '/:id',
    name: 'CrewDetails',
    component: CrewDetails,
    props: true,
  },
]
