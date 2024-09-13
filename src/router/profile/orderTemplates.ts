import Details from '@/pages/profile/orderTemplate/details'
import List from '@/pages/profile/orderTemplate/list'

const BASE_PATH = 'order_templates'

export default [
  {
    path: BASE_PATH,
    name: 'OrderTemplateList',
    component: List,
    meta: {
      permission: 'orderTemplate:readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'OrderTemplateCreate',
    component: Details,
    props: true,
    meta: {
      permission: 'orderTemplate:readItem',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'OrderTemplateDetails',
    component: Details,
    props: true,
    meta: {
      permission: 'orderTemplate:readItem',
    },
  },
]
