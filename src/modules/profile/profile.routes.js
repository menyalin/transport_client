import Layout from './pages/layout'
import Companies from './pages/companyList'
import CompanyEdit from './pages/companyEdit'

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
    ],
  },
]
