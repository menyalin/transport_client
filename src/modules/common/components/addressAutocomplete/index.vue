<template>
  <div>
    <v-autocomplete
      :value="value"
      dense
      :hide-details="hideDetails"
      hide-no-data
      :items="items"
      :disabled="disabled"
      auto-select-first
      clearable
      :label="label"
      :outlined="outlined"
      :append-outer-icon="appendIcon"
      @click:append-outer="appendClick"
      @change="changeValue"
    />
    <v-dialog
      v-model="dialog"
      max-width="1100"
      persistent
    >
      <v-card>
        <app-details-address
          :id="value"
          openInModal
          @cancel="cancelDialog"
          @submit="submit"
          @deleteItem="deleteHandler"
        />
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import AppDetailsAddress from '@/modules/profile/pages/address/details'
export default {
  name: 'AddressAutocomplete',
  components: {
    AppDetailsAddress,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    label: String,
    pointType: {
      type: String,
      validator: function (val) {
        return ['loading', 'unloading'].includes(val)
      },
    },
    hideDetails: { type: Boolean, default: false },
    outlined: { type: Boolean, default: false },
    dense: { type: Boolean, default: false },
    value: String,
    disabled: { type: Boolean, default: false },
  },
  data() {
    return {
      dialog: false,
    }
  },
  computed: {
    appendIcon() {
      return this.value ? 'mdi-pencil' : 'mdi-plus-circle'
    },
    items() {
      return this.$store.getters.addressesForAutocomplete.filter(
        this.itemsFilter
      )
    },
  },
  methods: {
    itemsFilter(item) {
      if (!this.pointType) return true
      return item[this.pointType]
    },

    appendClick(val) {
      this.dialog = true
    },
    cancelDialog(val) {
      this.dialog = false
    },
    submit(val) {
      this.$emit('change', val)
      this.dialog = false
    },
    changeValue(val) {
      this.$emit('change', val)
    },
    deleteHandler() {
      this.$emit('change', null)
      // this.dialog = false
    },
  },
}
</script>
<style scoped></style>
