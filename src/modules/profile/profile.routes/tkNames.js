import TkNameCreate from '../pages/tkName/tkNameCreate'
import TkNameList from '../pages/tkName/tkNameList'
import TkNameDetails from '../pages/tkName/tkNameDetails'

const BASE_PATH = 'tk_names'

export default [
  {
    path: BASE_PATH,
    name: 'TkNameList',
    component: TkNameList,
  },
  {
    path: BASE_PATH + '/create',
    name: 'TkNameCreate',
    component: TkNameCreate,
  },
  {
    path: BASE_PATH + '/:id',
    name: 'TkNameDetails',
    component: TkNameDetails,
    props: true,
  },
]