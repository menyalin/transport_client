<template>
  <div class="ma-2">
    <div class="mb-2">
      <BlockTitle>{{ title }}</BlockTitle>
    </div>
    <v-text-field
      v-model="cargoParams.description"
      hide-details
      label="Груз"
      :style="{ 'max-width': '600px' }"
    />
    <div class="cargo-params-block py-2">
      <v-text-field v-model.number="cargoParams.weight" hide-details label="Вес, тонн" />
      <v-text-field v-model.number="cargoParams.plt" type="Number" hide-details label="Плт, шт" />
      <v-text-field v-model.number="cargoParams.volume" hide-details label="Объем, м3" />
      <v-text-field v-model="cargoParams.tRegime" hide-details label="t-режим" />
    </div>
    <div>
      <v-text-field
        v-model="cargoParams.note"
        hide-details
        label="Примечание"
        :style="{ 'max-width': '600px' }"
      />
    </div>
  </div>
</template>
<script setup>
import { BlockTitle } from '@/entities/order'

defineOptions({ name: 'CargoParams' })

const cargoParams = defineModel()

defineProps({ title: String })
</script>
<style scoped>
.cargo-params-block {
  display: grid;
  grid-template-columns: 120px 120px 120px 120px auto;
  gap: 15px;
}
</style>
