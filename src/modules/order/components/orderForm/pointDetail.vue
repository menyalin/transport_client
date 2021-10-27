<template>
  <div>
    <v-select
      :items="pointTypes"
      dense
      hide-details
      outlined
      :value="point.type"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'PointDetail',
  props: {
    point: {
      type: Object,
    },
  },
  computed: {
    ...mapGetters(['pointTypes']),
  },
}
</script>
<style></style>
