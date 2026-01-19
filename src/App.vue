<template>
  <div>
    <app-load-spinner v-if="appLoading" />
    <router-view v-else />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'
import { useAppStore } from './shared/useAppStore'

export default {
  name: 'App',
  components: {
    AppLoadSpinner,
  },
  setup() {
    useAppStore()
  },
  computed: {
    ...mapGetters(['appLoading']),
  },
}
</script>
