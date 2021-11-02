<template>
  <div>
    <v-autocomplete
      :label="label"
      :items="items"
      :value="value"
      :dense="dense"
      :hideDetails="hideDetails"
      :outlined="outlined"
      clearable
      :append-icon="appendIcon"
      @change="change"
      @click:append="appendClick"
    />
  </div>
</template>
<script>
export default {
  name: 'Autocomplete',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    hideDetails: { type: Boolean, default: false },
    outlined: { type: Boolean, default: false },
    dense: { type: Boolean, default: false },
    value: String,
    label: String,
    itemsGetter: String,
    formName: String,
    createRouteName: String,
    updateRouteName: String,
    fieldName: String,
  },
  data() {
    return { dialog: false }
  },
  computed: {
    items() {
      return this.$store.getters[this.itemsGetter]
    },
    appendIcon() {
      return this.value ? 'mdi-pencil' : 'mdi-plus-circle'
    },
  },

  methods: {
    change(val) {
      this.$emit('change', val)
    },
    appendClick() {
      if (this.value) {
        this.$router.push({
          name: this.updateRouteName,
          params: {
            id: this.value,
            initFormName: this.formName,
            fieldName: this.fieldName,
          },
        })
      } else {
        this.$router.push({
          name: this.createRouteName,
          params: {
            initFormName: this.formName,
            fieldName: this.fieldName,
          },
        })
      }
    },
  },
}
</script>
<style></style>
