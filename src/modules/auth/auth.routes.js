import truckService from '../profile/services/truck.service'
import AuthLayout from './pages/layout'
import loginPage from './pages/login'
import registrationPage from './pages/registration'

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
        component: () => import('./pages/forgotPassword.vue'),
      },
      {
        path: 'restore_password/:token',
        name: 'RestorePassword',
        props: true,
        component: () => import('./pages/restorePassword.vue'),
      }
    ],
  },
]
