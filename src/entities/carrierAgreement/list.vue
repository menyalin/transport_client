<template>
  <v-data-table-server
    :items="items"
    :headers="headers"
    item-key="_id"
    :loading="loading"
    :items-length="totalCount"
    :page="options.page"
    :items-per-page="options.itemsPerPage"
    height="70vh"
    @dblclick:row="dblClickRow"
    @update:options="updateOptionsHandler"
  />
</template>
<script setup>
defineOptions({
  name: 'CarrierAgreementList',
})

const options = defineModel('options')

defineProps({
  items: Array,
  headers: Array,
  totalCount: Number,
  loading: Boolean,
})

const emits = defineEmits(['dblClickRow'])
const dblClickRow = (_, { item }) => {
  emits('dblClickRow', item)
}

const updateOptionsHandler = (val) => {
  emits('update:options', val)
}
</script>
