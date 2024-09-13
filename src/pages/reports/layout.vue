<template>
  <v-app>
    <app-bar title="Отчеты" />
    <v-main>
      <router-view />
      <app-snackbar />
    </v-main>
  </v-app>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'

import AppBar from '@/modules/common/components/appBar'
import AppSnackbar from '@/modules/common/components/appSnackbar'

export default defineComponent({
  name: 'ProfileLayout',
  components: {
    AppBar,
    AppSnackbar,
  },
  data: () => ({}),
})
</script>
<style></style>
