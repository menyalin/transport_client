import Companies from '@/pages/admin/companies.vue'
import Contracts from '@/pages/admin/contracts.vue'
import AdminLayout from '@/pages/admin/layout.vue'
import MassOrdersUpdate from '@/pages/admin/massOrdersUpdate.vue'
import Users from '@/pages/admin/users.vue'

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
