<template>
  <div>тут будет список тарифов из группы</div>
</template>
<script>
export default {
  name: 'TariffGroupList',
  model: {
    prop: 'items',
    event: 'change',
  },
  props: {
    items: Array,
  },
}
</script>
<style lang=""></style>
