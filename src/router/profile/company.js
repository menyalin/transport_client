export default [
  {
    path: 'companies',
    name: 'companyList',
    component: () => import('@/pages/profile/company/list.vue'),
  },
  {
    path: 'companies/create',
    name: 'createNewCompany',
    component: () => import('@/pages/profile/company/create.vue'),
  },
  {
    path: 'companies/:id',
    name: 'companyDetails',
    component: () => import('@/pages/profile/company/details.vue'),
    props: true,
  },
]
