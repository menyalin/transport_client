<template>
  <div class="ma-2">
    <div class="mb-2">
      <BlockTitle>{{ title }}</BlockTitle>
    </div>
    <v-text-field
      v-model="state.description"
      outlined
      dense
      hide-details
      label="Груз"
      :style="{ 'max-width': '600px' }"
    />
    <div class="cargo-params-block py-2">
      <v-text-field
        v-model.number="state.weight"
        outlined
        dense
        type="Number"
        hide-details
        label="Вес, тонн"
      />
      <v-text-field
        v-model.number="state.plt"
        outlined
        dense
        type="Number"
        hide-details
        label="Плт, шт"
      />
      <v-text-field
        v-model.number="state.volume"
        outlined
        dense
        type="Number"
        hide-details
        label="Объем, м3"
      />
      <v-text-field
        v-model="state.tRegime"
        outlined
        dense
        hide-details
        label="t-режим"
      />
    </div>
    <div>
      <v-text-field
        v-model="state.note"
        outlined
        dense
        hide-details
        label="Примечание"
        :style="{ 'max-width': '600px' }"
      />
    </div>
  </div>
</template>
<script>
import { ref, watch } from 'vue'
import { BlockTitle } from '@/entities/order'
export default {
  name: 'CargoParams',
  components: {
    BlockTitle,
  },
  model: {
    prop: 'cargoParams',
    event: 'change',
  },
  props: {
    cargoParams: Object,
    title: String,
  },
  setup(props, ctx) {
    const state = ref({
      description: null,
      volume: null,
      weight: null,
      plt: null,
      tRegime: null,
      note: null,
    })
    watch(
      () => props.cargoParams,
      (val) => {
        state.value = val
      },
      { immediate: true }
    )
    watch(state.value, (val) => ctx.emit('change', { ...val }))

    return { state }
  },
}
</script>
<style scoped>
.cargo-params-block {
  display: grid;
  grid-template-columns: 120px 120px 120px 120px auto;
  gap: 15px;
}
</style>
