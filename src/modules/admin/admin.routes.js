import AdminLayout from './pages/layout'
import Users from './pages/users'
import Companies from './pages/companies'
import Contracts from './pages/contracts'

export default [
  {
    path: '/admin',
    component: AdminLayout,
    meta: {
      authRequired: true,
    },
    children: [
      { path: 'users', component: Users, name: 'adminUsers' },
      { path: 'contracts', component: Contracts, name: 'adminContracts' },
      { path: 'companies', component: Companies, name: 'adminCompanies' },
    ],
  },
]
