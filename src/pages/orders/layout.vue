<template>
  <v-app>
    <app-bar title="Рейсы">
      <ScheduleSettings v-if="$route.fullPath === '/schedule/'" />
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
import { ScheduleSettings } from '@/entities/order'

export default {
  name: 'ProfileLayout',

  components: {
    AppBar,
    AppSnackbar,
    ScheduleSettings,
  },
}
</script>
<style></style>
