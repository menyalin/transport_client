import List from '../pages/orderTemplate/list'
import Details from '../pages/orderTemplate/details'

const BASE_PATH = 'order_templates'

export default [
  {
    path: BASE_PATH,
    name: 'OrderTemplateList',
    component: List,
  },
  {
    path: BASE_PATH + '/create',
    name: 'OrderTemplateCreate',
    component: Details,
    props: true,
  },
  {
    path: BASE_PATH + '/:id',
    name: 'OrderTemplateDetails',
    component: Details,
    props: true,
  },
]
