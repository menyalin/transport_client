<template>
  <div>
    <span>Группировка:</span>
    <v-radio-group
      class="mt-0 pt-0"
      :value="value"
      dense
      hide-details
      row
      @change="change"
    >
      <v-radio
        v-for="item in items"
        :key="item.value"
        :disabled="item.disabled"
        class="mt-2"
        :label="item.text"
        :value="item.value"
      />
    </v-radio-group>
  </div>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'GroupBySettings',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: String,
    items: { type: Array, required: true },
  },
  emits: ['change'],

  methods: {
    change(e) {
      this.$emit('change', e)
    },
  },
})
</script>
<style></style>
