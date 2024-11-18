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
        text: 'Тарифные контракты',
        icon: 'mdi-file-document-multiple',
        link: '/accounting/tariff_contracts',
        onlyWithDirectoriesProfile: true,
        permission: 'tariffContract:readList',
      },
      {
        text: 'Входящие акты',
        icon: 'mdi-list-box ',
        link: '/accounting/incomingInvoice',
        onlyWithDirectoriesProfile: true,
        permission: 'incomingInvoice:readList',
      },
      {
        text: 'Исходящие акты',
        icon: 'mdi-list-box ',
        link: '/accounting/paymentInvoice',
        onlyWithDirectoriesProfile: true,
        permission: 'paymentInvoice:readList',
      },

      {
        text: 'Описи документов',
        icon: 'mdi-list-box ',
        link: '/accounting/docsRegistry',
        onlyWithDirectoriesProfile: true,
        permission: 'docsRegistry:readList',
      },
      {
        text: 'ЗП Водителей',
        icon: 'mdi-cash ',
        link: '/accounting/driversSalary',
        onlyWithDirectoriesProfile: true,
        permission: 'salaryTariff:readList',
      },
      {
        text: 'Зарплатные тарифы',
        icon: 'mdi-cash ',
        link: '/accounting/salaryTariffs',
        onlyWithDirectoriesProfile: true,
        permission: 'salaryTariff:readList',
      },
    ],
  }),
}
</script>
<style></style>
