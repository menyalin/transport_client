import TkNameCreate from '@/pages/profile/tkName/tkNameCreate'
import TkNameList from '@/pages/profile/tkName/tkNameList'
import TkNameDetails from '@/pages/profile/tkName/tkNameDetails'

const BASE_PATH = 'tk_names'

export default [
  {
    path: BASE_PATH,
    name: 'TkNameList',
    component: TkNameList,
    meta: {
      permission: 'tkName:readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'TkNameCreate',
    component: TkNameCreate,
    meta: {
      permission: 'tkName:readItem',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'TkNameDetails',
    component: TkNameDetails,
    props: true,
    meta: {
      permission: 'tkName:readItem',
    },
  },
]
