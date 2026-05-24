<template>
  <v-menu :close-on-content-click="false">
    <template #activator="{ props }">
      <v-btn color="primary" v-bind="props" icon>
        <v-icon size="small"> mdi-cog </v-icon>
      </v-btn>
    </template>
    <v-list class="px-2">
      <v-switch
        v-for="field of allHeaders"
        :key="field.value"
        :model-value="tmpHeaders.includes(field.value)"
        :label="field.text"
        hide-details
        @update:model-value="toggleHeader(field.value)"
      />
    </v-list>
  </v-menu>
</template>
<script>
export default {
  name: 'TableColumnSettings',
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
    allHeaders: {
      type: Array,
      required: true,
    },
    defaultHeaders: Array,
    listSettingsName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      tmpHeaders: [],
    }
  },
  watch: {
    modelValue: {
      immediate: true,
      deep: true,
      handler: function (val) {
        if (Array.isArray(val)) this.tmpHeaders = [...val]
      },
    },
  },
  mounted() {
    if (!this.modelValue || this.modelValue.length === 0) {
      const savedHeaders = JSON.parse(localStorage.getItem(this.listSettingsName))
      if (savedHeaders) this.tmpHeaders = savedHeaders
      else this.tmpHeaders = this.defaultHeaders || []
      this.emitActiveHeaders()
    }
  },
  methods: {
    emitActiveHeaders() {
      this.$emit('update:modelValue', this.tmpHeaders)
    },

    toggleHeader(field) {
      if (this.tmpHeaders.includes(field)) {
        this.tmpHeaders = this.tmpHeaders.filter((i) => i !== field)
      } else {
        this.tmpHeaders.push(field)
      }
      localStorage.setItem(this.listSettingsName, JSON.stringify(this.tmpHeaders))
      this.emitActiveHeaders()
    },
  },
}
</script>
<style scoped></style>
