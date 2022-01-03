<template>
  <span
    class="note-wrapper"
    :style="styles"
    @dblclick="dblCLickHandler"
  >
    тут будет напоминание
  </span>
</template>
<script>
export default {
  name: 'Note',
  props: {
    styles: {
      type: Object,
    },
  },
  methods: {
    dblCLickHandler() {
      console.log('dbl')
    },
  },
}
</script>
<style scoped>
.note-wrapper {
  position: absolute;
  user-select: none;
  z-index: 0;
  font-size: 12px;
  letter-spacing: -0.008em;
  line-height: 16px;
  font-weight: 400;
  font-style: normal;
}
</style>
