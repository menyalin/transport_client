export default [
  {
    path: 'companies',
    name: 'companyList',
    component: () => import('../pages/company/list.vue'),
  },
  {
    path: 'companies/create',
    name: 'createNewCompany',
    component: () => import('../pages/company/create.vue'),
  },
  {
    path: 'companies/:id',
    name: 'companyDetails',
    component: () => import('../pages/company/details.vue'),
    props: true,
  },
]
