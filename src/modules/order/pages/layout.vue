<template>
  <v-app>
    <app-bar title="Рейсы" />
    <v-main>
      <router-view />
      <app-snackbar />
    </v-main>
  </v-app>
</template>
<script>
import AppBar from '@/modules/common/components/appBar'
import AppSnackbar from '@/modules/common/components/appSnackbar'

export default {
  name: 'ProfileLayout',
  components: {
    AppBar,
    AppSnackbar,
  },
  data: () => ({}),
}
</script>
<style></style>
