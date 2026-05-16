<template>
  <v-app>
    <app-admin-bar title="Admin panel" />
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
import AppAdminBar from '@/modules/common/components/appBar/index.vue'
import AppLeftNav from '@/modules/common/components/leftNav/index.vue'
import AppSnackbar from '@/modules/common/components/appSnackbar/index.vue'

export default {
  name: 'AdminLayout',
  components: {
    AppAdminBar,
    AppLeftNav,
    AppSnackbar,
  },
  data: () => ({
    navButtons: [
      { text: 'Users', icon: 'mdi-account-multiple', link: '/admin/users' },
      { text: 'Companies', icon: 'mdi-star', link: '/admin/companies' },
      { text: 'Contracts', icon: 'mdi-history', link: '/admin/contracts' },
      { text: 'Обнволение рейсов', icon: 'mdi-history', link: '/admin/orders' },
    ],
  }),
}
</script>
<style></style>
