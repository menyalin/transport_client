<template>
  <div :class="{ invalid: !isValid }">
    <app-block-title>{{ title }}</app-block-title>
    <draggable v-model="xPoints">
      <transition-group name="route">
        <div
          v-for="(point, ind) of tmpPoints"
          :key="ind"
          class="point-wrapper-outer"
        >
          <app-point-detail
            :point="point"
            :ind="ind"
            :confirmed="confirmed"
            :isActive="activePointInd === ind"
            :showDeleteBtn="tmpPoints.length > 2"
            @changePoint="change($event, ind)"
            @delete="deleteHandler"
          />
        </div>
      </transition-group>
    </draggable>

    <v-btn
      text
      color="primary"
      small
      @click="addPoint"
    >
      Добавить адрес
    </v-btn>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import AppPointDetail from './pointDetail'
import AppBlockTitle from './blockTitle.vue'
export default {
  name: 'RoutePoints',
  components: {
    AppPointDetail,
    AppBlockTitle,
    draggable,
  },
  model: {
    prop: 'points',
    event: 'changePoints',
  },
  props: {
    points: Array,
    title: String,
    confirmed: Boolean,
    isValid: Boolean,
  },
  data() {
    return {
      tmpPoints: [],
    }
  },
  computed: {
    xPoints: {
      get() {
        return this.tmpPoints
      },
      set(val) {
        this.$emit('changePoints', val)
      },
    },
    activePointInd() {
      return this.tmpPoints.findIndex((p) => !p.departureDate)
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
    addPoint() {
      this.tmpPoints.push({
        type: 'unloading',
      })
      this.$emit('changePoints', this.tmpPoints)
    },
    deleteHandler(ind) {
      this.tmpPoints.splice(ind, 1)
      this.$emit('changePoints', this.tmpPoints)
    },
  },
}
</script>
<style scoped>
.invalid {
  border: tomato 1px solid;
}
.point-wrapper-outer {
  border: 1px dotted gray;
  border-radius: 5px;
  margin: 5px;
}
.route-move {
  transition: transform 0.5s;
}
</style>
