<template>
  <v-app>
    <app-bar />
    <v-main>
      <div class="layout">
        <app-left-nav :items="navButtons" />
        <router-view />
      </div>
      <app-snackbar />
    </v-main>
  </v-app>
</template>
<script>
import AppBar from '@/modules/common/components/appBar'
import AppSnackbar from '@/modules/common/components/appSnackbar'
import AppLeftNav from '@/modules/common/components/leftNav'

export default {
  name: 'ProfileLayout',

  components: {
    AppBar,
    AppSnackbar,
    AppLeftNav,
  },

  data: () => ({
    navButtons: [
      {
        text: 'ЗП Водителей',
        icon: 'mdi-cash ',
        link: '/accounting/driversSalary',
        onlyWithDirectoriesProfile: true,
      },
      {
        text: 'Зарплатные тарифы',
        icon: 'mdi-cash ',
        link: '/accounting/salaryTariffs',
        onlyWithDirectoriesProfile: true,
      },
    ],
  }),
}
</script>
<style></style>
