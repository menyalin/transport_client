<template>
  <div id="block">
    <span id="title">{{ title }}</span>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'BorderedBlock',
  props: {
    title: String,
  },
}
</script>
<style scoped>
  #block {
    border: 1px solid gray;
    padding: 8px;
    position: relative;
    border-radius: 5px;
  }
  #title {
    position: absolute;
    font-size: small;
    color: #666666;
    line-height: 14px;
    padding: 0 8px;
    top: -8px;
    left: 25px;
    background-color: white;
    z-index: 1;
  }
</style>
