<template>
  <v-app>
    <app-bar title="Рейсы">
      <app-schedule-settings />
    </app-bar>
    <v-main>
      <router-view />
      <app-snackbar />
    </v-main>
  </v-app>
</template>
<script>
import AppBar from '@/modules/common/components/appBar'
import AppSnackbar from '@/modules/common/components/appSnackbar'
import AppScheduleSettings from '@/modules/order/components/scheduleSetting'

export default {
  name: 'ProfileLayout',

  components: {
    AppBar,
    AppSnackbar,
    AppScheduleSettings,
  },
  data: () => ({}),
}
</script>
<style></style>
