<template>
  <app-bar title="Отчеты" />
  <v-main>
    <router-view />
    <app-snackbar />
  </v-main>
</template>
<script>
import AppBar from '@/modules/common/components/appBar/index.vue'
import AppSnackbar from '@/modules/common/components/appSnackbar/index.vue'

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
