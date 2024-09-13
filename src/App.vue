<template>
  <v-app>
    <v-main>
      <LoadSpinner />
      <!-- <app-load-spinner v-if="appLoading" /> -->
      <!-- <router-view v-else /> -->
    </v-main>
  </v-app>
</template>

<script lang="ts">
// import { mapGetters } from 'vuex'
import { defineComponent } from 'vue'

import { LoadSpinner } from '@/shared/ui'

export default defineComponent({
  name: 'App',
  components: {
    LoadSpinner,
  },
  // computed: {
  //   ...mapGetters(['appLoading']),
  // },
})
</script>
