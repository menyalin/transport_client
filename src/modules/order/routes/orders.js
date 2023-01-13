import DetailsOrder from '../pages/orders/details'
import CreateOrderGroup from '../pages/orderGroupCreate/index.vue'

export default [
  {
    path: '/',
    name: 'ListOrder',
    component: () => import('@/pages/orders/list'),
  },
  {
    path: 'create',
    name: 'CreateOrder',
    component: DetailsOrder,
    props: true,
    meta: {
      permission: 'order:daysForWrite',
    },
  },
  {
    path: 'group',
    name: 'CreateOrderGroup',
    component: CreateOrderGroup,
    props: true,
    meta: {
      permission: 'order:groupCreate',
    },
  },
  { path: ':id', name: 'DetailsOrder', component: DetailsOrder, props: true },
]
