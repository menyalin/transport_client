<template>
  <v-select
    :value="value"
    :label="label"
    :multiple="multiple"
    :items="items"
    :dense="dense"
    :hideDetails="hideDetails"
    :outlined="outlined"
    :clearable="clearable"
    @change="changeHandler"
  />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { ref } from 'vue'

import { ORDER_DOC_STATUSES } from '@/shared/constants'
export default defineComponent({
  name: 'OrderDocStatusSelector',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Array || String,
    },
    label: {
      type: String,
      default: 'Документы',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    dense: Boolean,
    hideDetails: Boolean,
    outlined: Boolean,
    clearable: Boolean,
  },
  emits: ['change'],
  setup(_props, ctx) {
    const items = ref(ORDER_DOC_STATUSES)
    function changeHandler(value: string | null) {
      ctx.emit('change', value)
    }
    return {
      items,
      changeHandler,
    }
  },
})
</script>
