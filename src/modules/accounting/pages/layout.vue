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
        text: 'Список рейсов',
        icon: 'mdi-truck-fast',
        link: '/accounting/orders',
        onlyWithDirectoriesProfile: true,
      },
    ],
  }),
}
</script>
<style></style>
