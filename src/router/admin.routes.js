import AdminLayout from '@/pages/admin/layout'
import Users from '@/pages/admin/users'
import Companies from '@/pages/admin/companies'
import Contracts from '@/pages/admin/contracts'
import MassOrdersUpdate from '@/pages/admin/massOrdersUpdate'

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
      { path: 'orders', component: MassOrdersUpdate, name: 'massOrdersUpdate' },
    ],
  },
]
