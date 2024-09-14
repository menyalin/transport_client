<template>
  <div>
    <v-autocomplete
      v-model:search-input="search"
      :label="label"
      :items="items"
      :model-value="value"
      :density="dense ? 'compact' : undefined"
      :disabled="disabled"
      :hideDetails="hideDetails"
      :outlined="outlined"
      clearable
      :append-icon="appendIcon"
      @update:model-value="change"
      @click:append="appendClick"
    />
  </div>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
export default defineComponent({
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
    appendIcon() {
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
})
</script>
<style></style>
