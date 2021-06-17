<template>
  <div>
    <app-load-spinner v-if="appLoading" />
    <router-view v-else />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'

export default {
  name: 'App',
  computed: {
    ...mapGetters(['appLoading']),
  },
  components: {
    AppLoadSpinner,
  },
}
</script>
