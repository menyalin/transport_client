<template>
  <v-app>
    <app-admin-bar title="User profile" />
    <v-main>
      <v-container fluid>
        <v-row>
          <v-col cols="auto">
            <app-left-nav :items="navButtons" />
          </v-col>
          <v-col>
            <router-view />
          </v-col>
        </v-row>
      </v-container>
      <app-snackbar />
    </v-main>
  </v-app>
</template>
<script>
import AppAdminBar from '@/modules/common/components/appBar'
import AppLeftNav from '@/modules/common/components/leftNav'
import AppSnackbar from '@/modules/common/components/appSnackbar'

export default {
  name: 'ProfileLayout',
  components: {
    AppAdminBar,
    AppLeftNav,
    AppSnackbar,
  },
  data: () => ({
    navButtons: [
      { text: 'Настройки профиля', icon: 'mdi-cog', link: '/profile/settings' },
      { text: 'Компании', icon: 'mdi-factory', link: '/profile/companies' },
      {
        text: 'Адреса',
        icon: 'mdi-domain',
        link: '/profile/address',
      },
      {
        text: 'Маршрутные листы',
        icon: 'mdi-cow',
        link: '/profile/routeSheets',
      },
      {
        text: 'Транспорт',
        icon: 'mdi-truck',
        link: '/profile/trucks',
      },
      {
        text: 'Водители',
        icon: 'mdi-card-account-details',
        link: '/profile/drivers',
      },
      {
        text: 'Задачи',
        icon: 'mdi-message-reply-text',
        link: '/profile/tasks',
      },
    ],
  }),
}
</script>
<style></style>
