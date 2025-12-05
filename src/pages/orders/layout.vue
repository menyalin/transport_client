<template>
  <v-app>
    <AppBar title="Рейсы">
      <ScheduleSettings v-if="$route.fullPath === '/schedule/'" />
    </AppBar>
    <v-main>
      <router-view />
      <AppSnackbar />
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
