<template>
  <tr class="append-row">
    <td
      v-for="column in headers"
      :key="column.value"
      :style="{ textAlign: column.align }"
    >
      <b v-if="column._total === 'sum'">
        {{
          new Intl.NumberFormat().format(getSum(column.field || column.value))
        }}
      </b>
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    headers: Array,
    items: Array,
  },
  setup(props) {
    function getSum(field) {
      return props.items.reduce(
        (res, item) => parseFloat(item[field] || 0) + res,
        0
      )
    }
    return { getSum }
  },
}
</script>

<style>
.append-row {
  position: sticky;
  bottom: 0;
  background-color: aliceblue;
}
</style>
>
