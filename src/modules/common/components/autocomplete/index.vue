<template>
  <div>
    <v-autocomplete
      v-model:searchInput="search"
      :label="label"
      :items="items"
      :modelValue="value"
      :disabled="disabled"
      :hideDetails="hideDetails"
      :outlined="outlined"
      clearable
      :appendIcon="appendIcon"
      @update:model-value="change"
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
      disabled: { type: Boolean, default: false },
      value: String,
      label: String,
      itemsGetter: String,
      formName: String,
      createRouteName: String,
      updateRouteName: String,
      fieldName: String,
    },
    data() {
      return {
        search: null,
      }
    },
    computed: {
      items() {
        return this.$store.getters[this.itemsGetter]
      },
      endIcon() {
        if (!this.createRouteName || !this.updateRouteName) return null
        return this.value ? 'mdi-pencil' : 'mdi-plus-circle'
      },
    },
    watch: {
      search: function (val) {
        this.$emit('changeSearch', val)
      },
    },

    methods: {
      change(val) {
        this.$emit('change', val)
      },
      endClick() {
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
