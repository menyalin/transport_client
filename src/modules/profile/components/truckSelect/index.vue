<template>
  <v-select
    outlined
    dense
    :value="value"
    :label="label"
    :items="trucksForSelect"
    item-text="regNum"
    item-value="_id"
    :disabled="disabled"
    @change="change"
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
