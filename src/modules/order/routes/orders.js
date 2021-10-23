import ListOrder from '../pages/orders/list'
import CreateOrder from '../pages/orders/create'
import DetailsOrder from '../pages/orders/details'

export default [
  { path: '/', name: 'ListOrder', component: ListOrder },
  { path: 'create', name: 'CreateOrder', component: CreateOrder },
  { path: ':id', name: 'DetailsOrder', component: DetailsOrder, props: true },
]
