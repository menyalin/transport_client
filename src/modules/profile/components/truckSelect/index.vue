<template>
  <v-select
    variant="outlined"
    density="compact"
    :hide-details="hideDetails"
    :model-value="value"
    :label="label"
    :items="trucksForSelect"
    item-title="regNum"
    item-value="_id"
    :disabled="disabled"
    @update:model-value="change"
  />
</template>
<script>
export default {
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
}
</script>
<style></style>
