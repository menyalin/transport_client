<template>
  <v-autocomplete
    v-bind="$attrs"
    :items="items"
    :value="value"
    @change="onInput"
    show-select
  >
    <template v-slot:append-item>
      <v-btn icon @click="createNewItem">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <template v-slot:item="{ item }">
      {{ item[$attrs['item-text'] || 'text'] }}
      <v-spacer />
      <v-btn icon @click="editItem(item)">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  name: 'AutoCompleteWithActions',
  model: {
    prop: 'value',
    event: 'update',
  },
  props: {
    value: null,
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selected: null,
    }
  },
  methods: {
    onInput(value) {
      this.$emit('update', value)
    },
    createNewItem() {
      this.$emit('create')
    },
    editItem(item) {
      this.$emit('edit', item)
    },
  },
}
</script>
