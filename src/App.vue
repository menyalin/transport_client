<template>
  <v-app>
    <v-main>
      <load-spinner v-if="appLoading || true" />
      <router-view v-else />
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import { LoadSpinner } from '@/shared/ui'

export default {
  name: 'App',
  components: {
    LoadSpinner,
  },
  computed: {
    ...mapGetters(['appLoading']),
  },
}
</script>
