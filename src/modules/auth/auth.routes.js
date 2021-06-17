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
    ],
  },
]
