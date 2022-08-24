import List from '../pages/fine/list'
import Details from '../pages/fine/details'

const BASE_PATH = 'fines'

export default [
  {
    path: BASE_PATH,
    name: 'FineList',
    component: List,
    meta: {
      permission: 'fine:readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'FineCreate',
    component: Details,
    props: true,
    meta: {
      permission: 'fine:readItem',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'FineDetails',
    component: Details,
    props: true,
    meta: {
      permission: 'fine:readItem',
    },
  },
]
