<template>
  <v-select
    outlined
    dense
    :hide-details="hideDetails"
    :value="value"
    :label="label"
    :items="trucksForSelect"
    item-text="regNum"
    item-value="_id"
    :disabled="disabled"
    @change="change"
  />
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'TruckSelect',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: String,
    },
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
  },
  computed: {
    trucksForSelect() {
      return this.$store.getters.trucksForSelect({
        type: this.type,
        tkName: this.tkName,
      })
    },
  },
  methods: {
    change(val) {
      this.$emit('change', val)
    },
  },
})
</script>
<style></style>
