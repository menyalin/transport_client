<template>
  <div :class="{ 'mb-4': showHint && hint }">
    <v-autocomplete
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
      :messages="messages"
      :hint="showHint && hint ? hint : null"
      :label="label"
      :outlined="outlined"
      :loading="loading"
      :error="error"
      :append-icon="hideAppendIcon ? null : appendIcon"
      @click:append="appendClick"
      @change="changeValue"
    />
    <v-dialog v-model="dialog" max-width="1100" persistent>
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
    onlyClients: { type: Boolean, default: false },
    onlyServices: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    hideAppendIcon: { type: Boolean, default: false },
    showHint: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    messages: Array,
    error: Boolean,
    multiple: { type: Boolean, default: false },
  },
  data() {
    return {
      dialog: false,
    }
  },
  computed: {
    hint() {
      return this.$store.getters.partnersMap.get(this.value)?.contacts || null
    },
    appendIcon() {
      return this.value ? 'mdi-pencil' : 'mdi-plus-circle'
    },
    items() {
      return this.$store.getters.partnersForAutocomplete
        .filter((p) => (this.onlyClients ? p.isClient : true))
        .filter((p) => (this.onlyServices ? p.isService : true))
    },
  },
  methods: {
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
      // this.dialog = false
    },
  },
}
</script>
<style scoped></style>
