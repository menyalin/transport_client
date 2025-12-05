<template>
  <div>
    <span>Группировка:</span>
    <v-radio-group
      class="mt-0 pt-0"
      :modelValue="value"
     
      hideDetails
      inline
      @update:model-value="change"
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
<script>
export default {
  name: 'GroupBySettings',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: String,
    items: { type: Array, required: true },
  },

  methods: {
    change(e) {
      this.$emit('change', e)
    },
  },
}
</script>
<style></style>
