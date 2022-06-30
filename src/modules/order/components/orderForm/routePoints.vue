<template>
  <div
    class="route-wrapper"
    :class="{ invalid: !isValid }"
  >
    <app-block-title>{{ title }}</app-block-title>
    <draggable
      v-model="xPoints"
      :disabled="!dragEnabled"
    >
      <div
        v-for="(point, ind) of tmpPoints"
        :key="ind"
        class="point-wrapper-outer"
      >
        <app-point-detail
          :point="point"
          :ind="ind"
          :readonly="readonly"
          :confirmed="confirmed"
          :fixedTimeSlots="fixedTimeSlots"
          :isActive="point.isCurrent"
          :showDeleteBtn="tmpPoints.length > 2"
          :isTemplate="isTemplate"
          @changePoint="change($event, ind)"
          @delete="deleteHandler"
        />
      </div>
    </draggable>
    <div
      v-if="!readonly"
      class="row py-3"
    >
      <v-btn
        text
        color="primary"
        small
        outlined
        class="ma-2"
        @click="addPoint"
      >
        Добавить адрес
      </v-btn>
      <v-btn
        v-if="!isTemplate && state.status === 'inProgress'"
        text
        outlined
        small
        color="red"
        class="ma-2"
        @click="addReturn"
      >
        Добавить возврат
      </v-btn>
    </div>
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
    state: Object,
    fixedTimeSlots: { type: Boolean, default: false },
    isTemplate: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tmpPoints: [],
    }
  },
  computed: {
    dragEnabled() {
      if (this.isTemplate) return true
      if (this.state?.driverNotified || this.state?.clientNotified) return false
      return ['needGet', 'getted'].includes(this.state?.status)
    },
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
    readonly() {
      if (this.isTemplate) return false
      return this.state.status === 'completed'
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
    addReturn() {
      this.tmpPoints.push({
        type: 'unloading',
        isReturn: true,
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
.route-wrapper {
  padding: 15px;
  border-radius: 5px;
}
.invalid {
  border: tomato 2px solid;

  border-radius: 5px;
}
.point-wrapper-outer {
  border: 2px dotted gray;
  border-radius: 5px;
  margin: 2px;
}
.route-move {
  transition: transform 0.5s;
}
</style>
