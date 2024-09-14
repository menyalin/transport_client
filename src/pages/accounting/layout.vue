<template>
  <div class="layout">
    <app-left-nav :items="navButtons" />
    <router-view />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

import AppLeftNav from '@/modules/common/components/leftNav/index.vue'

export default defineComponent({
  name: 'ProfileLayout',
  components: {
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
        text: 'Зарплатные тарифы',
        icon: 'mdi-cash ',
        link: '/accounting/salaryTariffs',
        onlyWithDirectoriesProfile: true,
      },
    ],
  }),
})
</script>
<style></style>
