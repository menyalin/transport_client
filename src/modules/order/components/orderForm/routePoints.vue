<template>
  <div class="wrapper">
    <app-point-detail
      v-for="(point, ind) in tmpPoints"
      :key="ind"
      :point="point"
    />
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
    event: 'change',
  },
  props: {
    points: Array,
  },
  data() {
    return {
      pointTypes: ['loading', 'unloading'],
      tmpPoints: [
        { type: 'loading', address: '', plannedDate: '', note: '' },
        { type: 'unloading', address: '', plannedDate: '', note: '' },
      ],
    }
  },
  computed: {
    ...mapGetters([]),
  },
  watch: {
    points: {
      immediate: true,
      handler: function (val) {
        if (!!val && val.length) {
          this.tmpPoints = val.slice()
        }
      },
    },
  },
  methods: {
    change(val, field) {
      this.params[field] = val
      this.$emit('change', this.params)
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
