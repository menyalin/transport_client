import List from '../pages/downtime/list'
import Details from '../pages/downtime/details'

const BASE_PATH = 'downtimes'

export default [
  {
    path: BASE_PATH,
    name: 'DowntimeList',
    component: List,
    meta: {
      permission: 'downtime:readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'DowntimeCreate',
    component: Details,
    props: true,
    meta: {
      permission: 'downtime:readItem',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'DowntimeDetails',
    component: Details,
    props: true,
    meta: {
      permission: 'downtime:readItem',
    },
  },
]
