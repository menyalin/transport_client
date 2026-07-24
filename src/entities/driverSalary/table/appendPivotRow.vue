<template>
  <tr class="append-row">
    <td v-for="column in headers" :key="column.value" style="text-align: left">
      <b v-if="column._total === 'sum'">
        {{ new Intl.NumberFormat().format(getSum(column.field || column.value)) }}
      </b>
    </td>
  </tr>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'AppAppendPivorRow' })

const props = defineProps({
  headers: Array,
  items: Array,
})

const sumByField = computed(() => {
  const sums = {}
  props.headers.forEach((h) => {
    if (h._total === 'sum') {
      sums[h.field || h.value] = props.items.reduce(
        (res, item) => parseFloat(item[h.field || h.value] || 0) + res,
        0
      )
    }
  })
  return sums
})

function getSum(field) {
  return sumByField.value[field]
}
</script>

<style>
.append-row {
  position: sticky;
  bottom: 0;
  background-color: aliceblue;
}
</style>
