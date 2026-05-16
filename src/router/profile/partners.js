import List from '@/pages/profile/partner/list.vue'
import Details from '@/pages/profile/partner/details.vue'

const BASE_PATH = 'partners'

export default [
  {
    path: BASE_PATH,
    name: 'PartnerList',
    component: List,
    meta: {
      permission: 'partner:readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'PartnerCreate',
    component: Details,
    props: true,
    meta: {
      permission: 'partner:readItem',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'PartnerDetails',
    component: Details,
    props: true,
    meta: {
      permission: 'partner:readItem',
    },
  },
]
