import List from '../pages/address/list'
import Details from '../pages/address/details'

const BASE_PATH = 'address'

export default [
  {
    path: BASE_PATH,
    name: 'AddressList',
    component: List,
  },
  {
    path: BASE_PATH + '/create',
    name: 'AddressCreate',
    component: Details,
    props: true,
  },
  {
    path: BASE_PATH + '/:id',
    name: 'AddressDetails',
    component: Details,
    props: true,
  },
]
