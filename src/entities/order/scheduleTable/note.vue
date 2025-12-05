<template>
  <span class="note-wrapper" :class="note.priority" :style="styles"
@dblclick="dblCLickHandler">
    {{ note.text }}
  </span>
</template>
<script>
export default {
  name: 'AppNote',
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
    font-weight: 300;
    font-style: normal;
    background-color: rgba(202, 123, 255, 0.288);
  }
  .middle {
    font-size: 14px;
    font-weight: 400;
    background-color: rgba(151, 248, 72, 0.445);
  }
  .high {
    font-size: 14px;
    font-weight: 500;
    color: black;
    z-index: 6;
    background-color: rgba(235, 255, 56, 0.7);
  }
</style>
