<template>
  <div class="wrapper">
    <div
      v-for="(point, ind) of tmpPoints"
      :key="ind"
    >
      <app-point-detail
        :point="point"
        @changePoint="change($event, ind)"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import AppPointDetail from './pointDetail'

export default {
  name: 'RoutePoints',
  components: {
    AppPointDetail,
  },
  model: {
    prop: 'points',
    event: 'changePoints',
  },
  props: {
    points: Array,
  },
  data() {
    return {
      // pointTypes: ['loading', 'unloading'],
      tmpPoints: [],
    }
  },
  computed: {
    // ...mapGetters([]),
  },
  watch: {
    points: {
      immediate: true,
      handler: function (val) {
        if (val && val.length) {
          this.tmpPoints = val.slice()
        }
      },
    },
  },
  methods: {
    change(val, ind) {
      this.tmpPoints.splice(ind, 1, val)
      this.$emit('changePoints', this.tmpPoints)
    },
  },
}
</script>
<style scoped>
.req-transport-block {
  display: grid;
  grid-template-columns: 160px 160px 160px;
  margin: 10px;
  gap: 15px;
}
</style>
