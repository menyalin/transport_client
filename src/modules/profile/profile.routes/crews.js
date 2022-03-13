import CrewCreate from '../pages/crew/crewCreate'
import CrewList from '../pages/crew/crewList'
import CrewDetails from '../pages/crew/crewDetails'
const BASE_PATH = 'crews'

export default [
  {
    path: BASE_PATH,
    name: 'CrewList',
    component: CrewList,
    meta: {
      permission: 'crew:readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'CrewCreate',
    component: CrewCreate,
    meta: {
      permission: 'crew:readItem',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'CrewDetails',
    component: CrewDetails,
    props: true,
    meta: {
      permission: 'crew:readItem',
    },
  },
]
