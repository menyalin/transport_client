<template>
  <div class="wrapper">
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
