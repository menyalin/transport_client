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
  {
    path: 'fill_dates',
    name: 'AutoFillOrderDates',
    component: () => import('@/pages/orders/autofillDates.vue'),
    props: true,
    meta: {
      permission: 'order:autoFillRouteDates',
    },
  },
  { path: ':id', name: 'DetailsOrder', component: DetailsOrder, props: true },
]
