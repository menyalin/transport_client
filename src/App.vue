<template>
  <v-app>
    <AppBar />
    <v-main>
      <LoadSpinner v-if="appLoading" />
      <router-view v-else />
    </v-main>
    <app-snackbar />
  </v-app>
</template>

<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'
import { LoadSpinner } from '@/shared/ui'
import AppBar from '@/widgets/appBar/index.vue'

export default defineComponent({
  name: 'App',
  components: {
    LoadSpinner,
    AppBar,
  },
  computed: {
    ...mapGetters(['appLoading']),
  },
})
</script>
