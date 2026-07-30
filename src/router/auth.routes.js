import AuthLayout from '@/pages/auth/layout.vue'
import loginPage from '@/pages/auth/login.vue'
import registrationPage from '@/pages/auth/registration.vue'

export default [
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      { path: 'login', component: loginPage, name: 'loginPage' },
      {
        path: 'registration',
        component: registrationPage,
        name: 'registrationPage',
      },
      {
        path: 'forgot_password',
        name: 'ForgotPassword',
        component: () => import('@/pages/auth/forgotPassword.vue'),
      },
      {
        path: 'restore_password/:token',
        name: 'RestorePassword',
        props: true,
        component: () => import('@/pages/auth/restorePassword.vue'),
      },
      {
        path: 'confirm_email/:token',
        name: 'ConfirmEmail',
        props: true,
        component: () => import('@/pages/auth/confirmEmail.vue'),
      },
    ],
  },
]
