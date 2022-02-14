<template>
  <div class="my-3">
    <h5 class="ma-2">
      Список зон
    </h5>
    <transition-group
      name="list"
      tag="div"
    >
      <div
        v-for="(zone, idx) in tmpZones"
        :key="idx"
        class="zone-row py-1"
      >
        <span>До</span>
        <v-text-field
          v-model.number="zone.value"
          single-line
          outlined
          hide-details
          class="mx-1"
          dense
          :style="{ 'max-width': '60px' }"
        />
        <span>км</span>
        <v-text-field
          v-model.number="zone.price"
          single-line
          outlined
          hide-details
          class="mx-1 ml-6"
          dense
          :style="{ 'max-width': '80px' }"
        />
        <span>руб</span>
      </div>
    </transition-group>

    <v-btn
      color="primary"
      text
      outlined
      small
      class="ma-3"
      @click="addZone"
    >
      Добавить
    </v-btn>
    <v-btn
      color="red"
      text
      outlined
      small
      class="ma-3"
      @click="deleteZone"
    >
      Удалить
    </v-btn>
  </div>
</template>
<script>
export default {
  name: 'DistanceZones',
  model: {
    prop: 'items',
    event: 'change',
  },
  props: {
    items: {
      type: Array,
    },
  },
  data: () => ({
    tmpZones: [],
  }),
  watch: {
    items: {
      immediate: true,
      deep: true,
      handler: function (val) {
        if (val) this.tmpZones = val
      },
    },
    tmpZones: function () {
      this.$emit('change', this.tmpZones)
    },
  },
  methods: {
    addZone() {
      this.tmpZones.push({ value: null, price: null })
    },
    deleteZone() {
      this.tmpZones.pop()
    },
  },
}
</script>
<style scoped>
.zone-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
