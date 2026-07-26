<template>
  <div class="d-flex flex-column ga-1">
    <span class="text-body-medium font-weight-medium">Группировка:</span>
    <v-radio-group v-model="modelValue" hide-details inline class="mt-0 pt-0">
      <v-radio
        v-for="item in items"
        :key="item.value"
        :disabled="item.disabled"
        class="ma-2"
        :label="item.text"
        :value="item.value"
      />
    </v-radio-group>
  </div>
</template>
<script setup>
defineOptions({ name: 'GroupBySettings' })

const modelValue = defineModel({ type: String })

defineProps({
  items: { type: Array, required: true },
})
</script>
<style scoped></style>
