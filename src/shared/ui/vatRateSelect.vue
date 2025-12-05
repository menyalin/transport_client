<template>
  <v-select v-bind="$attrs" :items="items" :modelValue="value"
@update:model-value="$emit('change', $event)" />
</template>
<script>
import { VAT_RATE_ITEMS } from '@/shared/constants'

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Number,
      default: null,
    },
  },

  setup() {
    return { items: VAT_RATE_ITEMS }
  },
}
</script>
<style lang=""></style>
