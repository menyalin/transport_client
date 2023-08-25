const BASE_PATH = 'documents'

export default [
  {
    path: BASE_PATH,
    name: 'DocumentList',
    component: () => import('@/pages/accounting/document/list'),
    meta: {
      permission: 'document:readList',
      title: 'Учет : Список документов',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'DocumentCreate',
    component: () => import('@/pages/accounting/document/details'),
    props: true,
    meta: {
      permission: 'document:readItem',
      title: 'Учет : Создание документа',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'DocumentDetails',
    component: () => import('@/pages/accounting/document/details'),
    props: true,
    meta: {
      permission: 'document:readItem',
      title: 'Учет : Документ',
    },
  },
]
