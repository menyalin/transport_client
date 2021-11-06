<template>
  <div class="ma-2">
    <div>
      <app-block-title>{{ title }}</app-block-title>
    </div>
    <div class="cargo-params-block py-2">
      <v-text-field
        :value="cargoParams.weight"
        outlined
        dense
        type="Number"
        hide-details
        label="Вес, тонн"
        @change="change($event, 'weight')"
      />
      <v-text-field
        :value="cargoParams.places"
        outlined
        dense
        type="Number"
        hide-details
        label="Плт, шт"
        @change="change($event, 'places')"
      />
      <v-text-field
        :value="cargoParams.tRegime"
        outlined
        dense
        hide-details
        label="t-режим"
        @change="change($event, 'tRegime')"
      />
    </div>
    <div>
      <v-text-field
        :value="cargoParams.note"
        outlined
        dense
        hide-details
        label="Примечание"
        @change="change($event, 'note')"
      />
    </div>
  </div>
</template>
<script>
import AppBlockTitle from './blockTitle.vue'
export default {
  name: 'CargoParams',
  components: {
    AppBlockTitle,
  },
  model: {
    prop: 'cargoParams',
    event: 'change',
  },
  props: {
    cargoParams: Object,
    title: String,
  },
  data() {
    return {
      params: {
        weight: null,
        places: null,
        note: null,
        tRegime: null,
      },
    }
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
.cargo-params-block {
  display: grid;
  grid-template-columns: 120px 120px 120px auto;

  gap: 15px;
}
</style>
