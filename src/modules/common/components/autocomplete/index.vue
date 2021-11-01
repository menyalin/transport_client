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
    createItemPath: String,
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
      console.log(-111)
      if (this.value) {
      } else {
        this.$router.push({
          path: this.createItemPath,
          params: {
            formName: this.formName,
            field: 'form.partner',
          },
        })
      }
    },
  },
}
</script>
<style></style>
