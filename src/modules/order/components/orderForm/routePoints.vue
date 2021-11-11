<template>
  <div
    class="wrapper"
    :class="{ invalid: !isValidRoute }"
  >
    <app-block-title>{{ title }}</app-block-title>
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
import AppPointDetail from './pointDetail'
import AppBlockTitle from './blockTitle.vue'
export default {
  name: 'RoutePoints',
  components: {
    AppPointDetail,
    AppBlockTitle,
  },
  model: {
    prop: 'points',
    event: 'changePoints',
  },
  props: {
    points: Array,
    title: String,
  },
  data() {
    return {
      tmpPoints: [],
    }
  },
  computed: {
    isValidRoute() {
      if (!this.tmpPoints) return false
      const length = this.tmpPoints.length >= 2
      const firstPoint = this.tmpPoints[0].type === 'loading'
      const lastPoint =
        this.tmpPoints[this.tmpPoints.length - 1].type === 'unloading'

      return length && firstPoint && lastPoint
    },
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
.invalid {
  border: tomato 1px solid;
}
</style>
