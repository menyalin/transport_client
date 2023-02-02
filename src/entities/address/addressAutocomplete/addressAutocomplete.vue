<template>
  <v-autocomplete
    ref="input"
    :value="value"
    :dense="dense"
    auto-select-first
    :hide-details="hideDetails"
    :readonly="readonly"
    hide-no-data
    cache-items
    :items="items"
    :disabled="disabled"
    :clearable="!readonly"
    :label="label"
    :outlined="outlined"
    :multiple="multiple"
    @change="changeValue"
  />
</template>
<script>
export default {
  name: 'AddressAutocomplete',

  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    label: String,
    pointType: {
      type: String,
      validator: function (val) {
        return ['loading', 'unloading', 'service'].includes(val)
      },
    },
    hideAppendIcon: { type: Boolean, default: false },
    partnerId: String,
    hideDetails: { type: Boolean, default: false },
    outlined: { type: Boolean, default: false },
    dense: { type: Boolean, default: false },
    value: [String, Array],
    disabled: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    readonly: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    items() {
      return this.$store.getters.addressesForAutocomplete.filter(
        this.itemsFilter
      )
    },
  },
  methods: {
    focus() {
      this.$refs.input.focus()
    },
    itemsFilter(item) {
      if (item.value === this.value) return true
      if (this.partnerId && this.partnerId !== item.partner) return false
      if (!this.pointType) return true
      return item[this.pointType]
    },
    changeValue(val) {
      this.$emit('change', val)
    },
    deleteHandler() {
      this.$emit('change', null)
    },
  },
}
</script>
<style scoped></style>
