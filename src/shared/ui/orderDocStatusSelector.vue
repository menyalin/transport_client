<template>
  <v-select
    v-bind="$attrs"
    :value="value"
    :items="items"
    @change="changeHandler"
  />
</template>
<script>
import { ref } from 'vue'
import { ORDER_DOC_STATUSES } from '@/shared/constants'
export default {
  name: 'OrderDocStatusSelector',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Array || String,
    },
  },
  setup(_props, ctx) {
    const items = ref(ORDER_DOC_STATUSES)
    function changeHandler(value) {
      ctx.emit('change', value)
    }
    return {
      items,
      changeHandler,
    }
  },
}
</script>
