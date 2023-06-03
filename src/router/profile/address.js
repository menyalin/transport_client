import List from '@/pages/profile/address/list'
import Details from '@/pages/profile/address/details'

const BASE_PATH = 'address'

export default [
  {
    path: BASE_PATH,
    name: 'AddressList',
    component: List,
    meta: {
      permission: 'address:readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'AddressCreate',
    component: Details,
    meta: {
      permission: 'address:readItem',
    },
    props: true,
  },
  {
    path: BASE_PATH + '/:id',
    name: 'AddressDetails',
    component: Details,
    meta: {
      permission: 'address:readItem',
    },
    props: true,
  },
]
