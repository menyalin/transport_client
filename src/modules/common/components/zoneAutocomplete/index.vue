<template>
  <div>
    <v-autocomplete
      ref="input"
      :modelValue="value"
     
      :hideDetails="hideDetails"
      hideNoData
      :items="items"
      :disabled="disabled"
      autoSelectFirst
      clearable
      :multiple="multiple"
      persistentHint
      :label="label"
      :outlined="outlined"
      :appendIcon="hideAppendIcon || multiple ? null :endIcon"
      @click:append="appendClick"
      @update:model-value="changeValue"
    />
    <v-dialog :modelValue="dialog" maxWidth="700" persistent @update:model-value="$emit('update:dialog', $event)">
      <v-card>
        <AppDetailsZone :id="value" openInModal @cancel="cancelDialog" @submit="submit" @deleteItem="deleteHandler" />
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import AppDetailsZone from '@/pages/profile/zone/details'

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
   endIcon() {
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
   endClick() {
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
