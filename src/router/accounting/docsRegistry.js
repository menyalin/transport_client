import DocsRegistryList from '@/pages/accounting/docsRegistry/list.vue'
import DocsRegistryDetails from '@/pages/accounting/docsRegistry/details.vue'

const BASE_PATH = 'docsRegistry'

export default [
  {
    path: BASE_PATH,
    name: 'DocsRegistryList',
    component: DocsRegistryList,
    meta: {
      title: 'Учет : Список описей',
      permission: 'docsRegistry:readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'DocsRegistryCreate',
    component: DocsRegistryDetails,
    props: true,
    meta: {
      title: 'Учет : Новая опись',
      permission: 'docsRegistry:write',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'DocsRegistryDetail',
    component: DocsRegistryDetails,
    props: true,
    meta: {
      title: 'Учет : Опись',
      permission: 'docsRegistry:readItem',
    },
  },
]
