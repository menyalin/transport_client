const BASE_PATH = 'docsRegistry'

export default [
  {
    path: BASE_PATH,
    name: 'DocsRegistryList',
    component: () => import('@/pages/accounting/docsRegistry/list.vue'),
    meta: {
      title: 'Учет : Список описей',
      permission: 'docsRegistry:readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'DocsRegistryCreate',
    component: () => import('@/pages/accounting/docsRegistry/details.vue'),
    props: true,
    meta: {
      title: 'Учет : Новая опись',
      permission: 'docsRegistry:write',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'DocsRegistryDetail',
    component: () => import('@/pages/accounting/docsRegistry/details.vue'),
    props: true,
    meta: {
      title: 'Учет : Опись',
      permission: 'docsRegistry:readItem',
    },
  },
]
