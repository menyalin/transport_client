<template>
  <div>
    <span>Группировка:</span>
    <v-radio-group
      class="mt-0 pt-0"
      :model-value="modelValue"
      hide-details
      inline
      @update:model-value="modelValue = $event"
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
<script setup>
defineOptions({ name: 'GroupBySettings' })

const modelValue = defineModel()

defineProps({
  items: { type: Array, required: true },
})
</script>
<style></style>
