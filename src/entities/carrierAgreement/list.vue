<template>
  <v-data-table
    :items="items"
    :headers="headers"
    itemKey="_id"
    :loading="loading"
    :itemsLength="totalCount"
    :options="options"
   
    height="70vh"
    :footerProps="{
      'items-per-page-options': [50, 100, 200],
    }"
    @dblclick:row="dblClickRow"
    @update:options="updateOptionsHandler"
  />
</template>
<script>
export default {
  name: 'CarrierAgreementList',
  props: {
    items: Array,
    headers: Array,
    totalCount: Number,
    options: Object,
    settings: Object,
    loading: Boolean,
  },
  setup(props, ctx) {
    const dblClickRow = (...args) => ctx.emit('dblClickRow', ...args)

    const updateOptionsHandler = (...args) => {
      ctx.emit('update:options', ...args)
    }
    return {
      dblClickRow,
      updateOptionsHandler,
    }
  },
}
</script>
