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
      :append-icon="appendIcon"
      @click:append="appendClick"
      @change="changeValue"
    />
    <v-dialog
      v-model="dialog"
      max-width="1100"
      persistent
    >
      <v-card>
        <app-details-partner
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
import AppDetailsPartner from '@/modules/profile/pages/partner/details'
export default {
  name: 'PartnerAutocomplete',
  components: {
    AppDetailsPartner,
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
      return this.$store.getters.partnersForAutocomplete
    },
  },
  methods: {
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
