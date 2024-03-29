const BASE_PATH = 'docsRegistry'

export default [
  {
    path: BASE_PATH,
    name: 'DocsRegistryList',
    component: () => import('@/pages/accounting/docsRegistry/list.vue'),
    meta: {
      permission: 'docsRegistry:readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'DocsRegistryCreate',
    component: () => import('../../../pages/accounting/docsRegistry/details.vue'),
    props: true,
    meta: {
      permission: 'docsRegistry:write',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'DocsRegistryDetail',
    component: () => import('../../../pages/accounting/docsRegistry/details.vue'),
    props: true,
    meta: {
      permission: 'docsRegistry:readItem',
    },
  },
]
