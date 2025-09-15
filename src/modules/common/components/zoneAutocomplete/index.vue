<template>
  <div>
    <v-autocomplete
      ref="input"
      :v-bind="$attrs"
      :model-value="value"
      hide-no-data
      :items="items"
      auto-select-first
      clearable
      persistent-hint
      :multiple="multiple"
      :append-icon="hideAppendIcon || multiple ? null : appendIcon"
      @click:append="appendClick"
      @update:model-value="changeValue"
    />
    <v-dialog v-model="dialog" max-width="700" persistent>
      <v-card>
        <app-details-zone
          :id="value"
          openInModal
          @cancel="cancelDialog"
          @submit="submit"
          @delete-item="deleteHandler"
        />
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
    valuehideAppendIcon: { type: Boolean, default: false },
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
