<template>
  <!-- <app-schedule-settings v-if="$route.fullPath === '/schedule/'" /> -->
  <router-view />
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
// import AppScheduleSettings from '@/modules/order/components/scheduleSetting/index.vue'

// TODO: fix schedule settings

export default defineComponent({
  name: 'ProfileLayout',

  components: {
    // AppScheduleSettings,
  },
  data: () => ({}),
})
</script>
<style></style>
