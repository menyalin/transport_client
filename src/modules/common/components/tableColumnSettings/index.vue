<template>
  <v-menu offset-y :close-on-content-click="false">
    <template #activator="{ on, attrs }">
      <v-btn color="primary" dark v-bind="attrs" icon v-on="on">
        <v-icon small> mdi-cog </v-icon>
      </v-btn>
    </template>
    <v-list class="px-2">
      <v-switch
        v-for="field of allHeaders"
        :key="field.value"
        v-model="tmpHeaders"
        :label="field.text"
        :value="field.value"
        dense
        hide-details
        @change="inputHandler(field.value)"
      />
    </v-list>
  </v-menu>
</template>
<script>
export default {
  name: 'TableColumnSettings',
  model: {
    prop: 'activeHeaders',
    event: 'change',
  },
  props: {
    activeHeaders: {
      type: Array,
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
    activeHeaders: {
      immediate: true,
      deep: true,
      handler: function (val) {
        if (val) this.tmpHeaders = val
      },
    },
  },
  mounted() {
    if (!this.activeHeaders) {
      const savedHeaders = JSON.parse(
        localStorage.getItem(this.listSettingsName)
      )
      if (savedHeaders) this.tmpHeaders = savedHeaders
      else this.tmpHeaders = this.tmpHeaders = this.defaultHeaders
      this.emitActiveHeaders()
    }
  },
  methods: {
    emitActiveHeaders() {
      this.$emit('change', this.tmpHeaders)
    },

    inputHandler(field) {
      if (this.tmpHeaders.includes(field)) this.tmpHeaders.push(field)
      else this.tmpHeaders = this.tmpHeaders.filter((i) => i !== field)
      localStorage.setItem(
        this.listSettingsName,
        JSON.stringify(this.tmpHeaders)
      )
      this.$emit('change', this.tmpHeaders)
    },
  },
}
</script>
<style scoped></style>
