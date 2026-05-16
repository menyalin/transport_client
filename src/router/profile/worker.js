import WorkerList from '@/pages/profile/worker/list.vue'
import WorkerDetails from '@/pages/profile/worker/details.vue'

const BASE_PATH = 'workers'

export default [
  {
    path: BASE_PATH,
    name: 'WorkerList',
    component: WorkerList,
    meta: {
      permission: 'worker:readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'WorkerCreate',
    component: WorkerDetails,
    props: true,
    meta: {
      permission: 'worker:readItem',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'WorkerDetails',
    component: WorkerDetails,
    props: true,
    meta: {
      permission: 'worker:readItem',
    },
  },
]
