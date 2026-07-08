<template>
  <v-select
    :hide-details="hideDetails"
    v-model="modelValue"
    :label="label"
    :items="trucksForSelect"
    item-title="regNum"
    item-value="_id"
    :disabled="disabled"
  />
</template>
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

defineOptions({ name: 'TruckSelect' })

const modelValue = defineModel({ type: String })

const props = defineProps({
  label: {
    type: String,
    default: 'Транспортное средство',
  },
  type: {
    type: String,
  },
  tkName: {
    type: String,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  hideDetails: {
    type: Boolean,
    default: false,
  },
})

const store = useStore()

const trucksForSelect = computed(() =>
  store.getters.trucksForSelect({
    type: props.type,
    tkName: props.tkName,
  })
)
</script>
<style></style>
