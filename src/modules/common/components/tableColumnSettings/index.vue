<template>
  <v-menu offset-y :close-on-content-click="false">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" dark v-bind="attrs" icon v-on="on">
        <v-icon small> mdi-cog </v-icon>
      </v-btn>
    </template>
    <v-list v-if="activeHeaders" class="px-2">
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
        this.tmpHeaders = val
      },
    },
  },
  methods: {
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
