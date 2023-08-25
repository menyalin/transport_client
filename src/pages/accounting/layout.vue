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
        text: 'Соглашения',
        icon: 'mdi-file-sign',
        link: '/accounting/agreements',
        onlyWithDirectoriesProfile: true,
        permission: 'agreement:readList',
      },
      {
        text: 'Документы',
        icon: 'mdi-file-document-multiple',
        link: '/accounting/documents',
        onlyWithDirectoriesProfile: true,
        permission: 'document:readList',
      },
      {
        text: 'Акты',
        icon: 'mdi-list-box ',
        link: '/accounting/paymentInvoice',
        onlyWithDirectoriesProfile: true,
      },
      {
        text: 'Описи документов',
        icon: 'mdi-list-box ',
        link: '/accounting/docsRegistry',
        onlyWithDirectoriesProfile: true,
      },
      {
        text: 'ЗП Водителей',
        icon: 'mdi-cash ',
        link: '/accounting/driversSalary',
        onlyWithDirectoriesProfile: true,
      },
      {
        text: 'Тарифы клиентов',
        icon: 'mdi-cash-multiple',
        link: '/accounting/tariffs',
        onlyWithDirectoriesProfile: true,
        permission: 'tariff:readList',
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
