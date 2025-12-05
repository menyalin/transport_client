<template>
  <div class="ma-2">
    <div class="mb-2">
      <BlockTitle>{{ title }}</BlockTitle>
    </div>
    <v-text-field
      v-model="state.description"
      variant="outlined"
       density="compact"
     
      hideDetails
      label="Груз"
      :style="{ 'max-width': '600px' }"
    />
    <div class="cargo-params-block py-2">
      <v-text-field
        v-model.number="state.weight"
        variant="outlined"
       density="compact"
       
        type="Number"
        hideDetails
        label="Вес, тонн"
      />
      <v-text-field
        v-model.number="state.plt"
        variant="outlined"
       density="compact"
       
        type="Number"
        hideDetails
        label="Плт, шт"
      />
      <v-text-field
        v-model.number="state.volume"
        variant="outlined"
       density="compact"
       
        type="Number"
        hideDetails
        label="Объем, м3"
      />
      <v-text-field v-model="state.tRegime" variant="outlined" hideDetails label="t-режим" />
       density="compact"
    </div>
    <div>
      <v-text-field
        v-model="state.note"
        variant="outlined"
       density="compact"
       
        hideDetails
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
      val => {
        state.value = val || {
          description: null,
          volume: null,
          weight: null,
          plt: null,
          tRegime: null,
          note: null,
        }
      },
      { immediate: true }
    )
    watch(
      () => state.value,
      val => ctx.emit('change', { ...val })
    )

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
