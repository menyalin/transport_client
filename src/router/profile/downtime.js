import List from '@/pages/profile/downtime/list.vue'
import Details from '@/pages/profile/downtime/details.vue'

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
    props: (route) => ({
      truckId: route.query.truckId || undefined,
      startDate: route.query.startDate || undefined,
    }),
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
