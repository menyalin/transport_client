<template>
  <div>тут будет доплата водителю</div>
</template>
<script>
export default {
  name: 'PaymentToDriver',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: Object,
  },
}
</script>
<style scoped></style>
