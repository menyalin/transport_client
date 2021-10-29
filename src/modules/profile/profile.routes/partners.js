import Create from '../pages/partner/create'
import List from '../pages/partner/list'
import Details from '../pages/partner/details'

const BASE_PATH = 'partners'

export default [
  {
    path: BASE_PATH,
    name: 'PartnerList',
    component: List,
  },
  {
    path: BASE_PATH + '/create',
    name: 'PartnerCreate',
    component: Create,
  },
  {
    path: BASE_PATH + '/:id',
    name: 'PartnerDetails',
    component: Details,
    props: true,
  },
]
