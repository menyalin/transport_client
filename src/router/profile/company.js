import CompanyList from '@/pages/profile/company/list.vue'
import CompanyCreate from '@/pages/profile/company/create.vue'
import CompanyDetails from '@/pages/profile/company/details.vue'

export default [
  {
    path: 'companies',
    name: 'companyList',
    component: CompanyList,
  },
  {
    path: 'companies/create',
    name: 'createNewCompany',
    component: CompanyCreate,
  },
  {
    path: 'companies/:id',
    name: 'companyDetails',
    component: CompanyDetails,
    props: true,
  },
]