<template>
  <div class="cargo-params-block">
    <v-text-field
      :value="cargoParams.weight"
      outlined
      dense
      type="Number"
      hide-details
      label="Вес"
      @change="change($event, 'weight')"
    />
    <v-text-field
      :value="cargoParams.places"
      outlined
      dense
      type="Number"
      hide-details
      label="Плт"
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
    <v-text-field
      :value="cargoParams.note"
      outlined
      dense
      hide-details
      label="Примечание"
      @change="change($event, 'note')"
    />
  </div>
</template>
<script>
export default {
  name: 'CargoParams',
  model: {
    prop: 'cargoParams',
    event: 'change',
  },
  props: {
    cargoParams: Object,
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
  margin: 10px;
  gap: 15px;
}
</style>
