import RouteSheetCreate from '../pages/routeSheet/routeSheetCreate'
import RouteSheetList from '../pages/routeSheet/routeSheetList'
import RouteSheetDetails from '../pages/routeSheet/routeSheetDetails'
const BASE_PATH = 'routeSheets'

export default [
  {
    path: BASE_PATH,
    name: 'RouteSheetList',
    component: RouteSheetList,
  },
  {
    path: BASE_PATH + '/create',
    name: 'RouteSheetCreate',
    component: RouteSheetCreate,
  },
  {
    path: BASE_PATH + '/:id',
    name: 'RouteSheetDetails',
    component: RouteSheetDetails,
    props: true,
  },
]
