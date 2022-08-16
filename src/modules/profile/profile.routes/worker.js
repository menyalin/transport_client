const BASE_PATH = 'workers'

export default [
  {
    path: BASE_PATH,
    name: 'WorkerList',
    component: () => import('../pages/worker/list'),
    meta: {
      permission: 'worker:readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'WorkerCreate',
    component: () => import('../pages/worker/details'),
    props: true,
    meta: {
      permission: 'worker:readItem',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'WorkerDetails',
    component: () => import('../pages/worker/details'),
    props: true,
    meta: {
      permission: 'worker:readItem',
    },
  },
]
