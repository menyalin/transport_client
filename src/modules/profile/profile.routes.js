import Layout from './pages/layout'
import Companies from './pages/companyList'
import CompanyEdit from './pages/companyEdit'
import CompanyDetails from './pages/companyDetails'
import TaskList from './pages/taskList'
import AddressCreate from './pages/addressCreate'
import ProfileSettings from './pages/profileSettings'

export default [
  {
    path: '/profile',
    component: Layout,
    meta: {
      authRequired: true,
    },
    children: [
      { path: 'companies', name: 'companyList', component: Companies },
      {
        path: 'companies/create',
        name: 'createNewCompany',
        component: CompanyEdit,
      },
      {
        path: 'companies/:id',
        name: 'companyDetails',
        component: CompanyDetails,
        props: true,
      },
      { path: 'tasks', name: 'taskList', component: TaskList },
      {
        path: 'address/create',
        name: 'createAddress',
        component: AddressCreate,
      },
      {
        path: 'settings',
        name: 'profileSettings',
        component: ProfileSettings,
      },
    ],
  },
]
