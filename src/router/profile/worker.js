const BASE_PATH = 'workers'

export default [
  {
    path: BASE_PATH,
    name: 'WorkerList',
    component: () => import('@/pages/profile/worker/list'),
    meta: {
      permission: 'worker:readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'WorkerCreate',
    component: () => import('@/pages/profile/worker/details'),
    props: true,
    meta: {
      permission: 'worker:readItem',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'WorkerDetails',
    component: () => import('@/pages/profile/worker/details'),
    props: true,
    meta: {
      permission: 'worker:readItem',
    },
  },
]
