import DetailsOrder from '@/pages/orders/details.vue'
import ListOrder from '@/pages/orders/list.vue'
import CreateOrderGroup from '@/pages/orders/orderGroupCreate.vue'
import AutoFillOrderDates from '@/pages/orders/autofillDates.vue'

export default [
  {
    path: '/',
    name: 'ListOrder',
    component: ListOrder,
  },
  {
    path: 'create',
    name: 'CreateOrder',
    component: DetailsOrder,
    props: true,
    meta: {
      permission: 'order:daysForWrite',
      title: 'Новый рейс',
    },
  },
  {
    path: 'group',
    name: 'CreateOrderGroup',
    component: CreateOrderGroup,
    props: true,
    meta: {
      permission: 'order:groupCreate',
      title: 'Создание группы рейсов',
    },
  },
  {
    path: 'fill_dates',
    name: 'AutoFillOrderDates',
    component: AutoFillOrderDates,
    props: true,
    meta: {
      permission: 'order:autoFillRouteDates',
      title: 'Заполнение рейсов',
    },
  },
  { path: ':id', name: 'DetailsOrder', component: DetailsOrder, props: true },
]
