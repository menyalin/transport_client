<template>
  <div>
    <AppLoadSpinner v-if="appLoading" />
    <router-view v-else />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'

export default {
  name: 'App',
  components: {
    AppLoadSpinner,
  },
  computed: {
    ...mapGetters(['appLoading']),
  },
}
</script>
