import ListOrder from '../pages/orders/list'
// import CreateOrder from '../pages/orders/create'
import DetailsOrder from '../pages/orders/details'
import CreateOrderGroup from '../pages/orderGroupCreate/index.vue'

export default [
  { path: '/', name: 'ListOrder', component: ListOrder },
  { path: 'create', name: 'CreateOrder', component: DetailsOrder, props: true },
  {
    path: 'group',
    name: 'CreateOrderGroup',
    component: CreateOrderGroup,
    props: true,
  },
  { path: ':id', name: 'DetailsOrder', component: DetailsOrder, props: true },
]
