<template>
  <span
    class="note-wrapper"
    :style="styles"
    @dblclick="dblCLickHandler"
  >
    {{ note.text }}
  </span>
</template>
<script>
export default {
  name: 'Note',
  props: {
    styles: {
      type: Object,
      required: true,
    },
    note: {
      type: Object,
      required: true,
    },
  },
  methods: {
    dblCLickHandler() {
      this.$router.push('/profile/schedule_notes/' + this.note._id)
    },
  },
}
</script>
<style scoped>
.note-wrapper {
  position: absolute;
  overflow: hidden;
  white-space: nowrap;
  user-select: none;
  z-index: 0;
  font-size: 12px;
  letter-spacing: -0.008em;
  line-height: 16px;
  font-weight: 400;
  font-style: normal;
  background-color: rgba(202, 123, 255, 0.493);
}
</style>
