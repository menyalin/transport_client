<template>
  <div>
    <v-autocomplete
      ref="input"
      :value="value"
      dense
      :hide-details="hideDetails"
      hide-no-data
      :items="items"
      :disabled="disabled"
      auto-select-first
      clearable
      :multiple="multiple"
      persistent-hint
      :label="label"
      :outlined="outlined"
      :append-icon="hideAppendIcon || multiple ? null : appendIcon"
      @click:append="appendClick"
      @change="changeValue"
    />
    <v-dialog
      v-model="dialog"
      max-width="700"
      persistent
    >
      <v-card>
        <app-details-zone
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
import AppDetailsZone from '@/modules/profile/pages/zone/details'
export default {
  name: 'ZoneAutocomplete',
  components: {
    AppDetailsZone,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    label: String,
    hideDetails: { type: Boolean, default: false },
    outlined: { type: Boolean, default: false },
    dense: { type: Boolean, default: false },
    value: [String, Array],
    disabled: { type: Boolean, default: false },
    hideAppendIcon: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
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
      return this.$store.getters.zonesForAutocomplete
    },
  },
  methods: {
    focus() {
      this.$refs.input.focus()
    },
    appendClick() {
      this.dialog = true
    },
    cancelDialog() {
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
    },
  },
}
</script>
<style scoped></style>
