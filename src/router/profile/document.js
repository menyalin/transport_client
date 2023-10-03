const BASE_PATH = 'documents'

export default [
  {
    path: BASE_PATH,
    name: 'DocumentList',
    component: () => import('@/pages/profile/document/list'),
    meta: {
      permission: 'document:readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'DocumentCreate',
    component: () => import('@/pages/profile/document/details'),
    props: true,
    meta: {
      permission: 'document:readItem',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'DocumentDetails',
    component: () => import('@/pages/profile/document/details'),
    props: true,
    meta: {
      permission: 'document:readItem',
    },
  },
]
