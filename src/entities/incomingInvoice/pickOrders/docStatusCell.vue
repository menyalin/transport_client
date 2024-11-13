<template>
  <div class="statusWrapper" :style="{ color: res.color }">{{ res.text }}</div>
</template>
<script>
import { computed } from 'vue'
export default {
  name: 'DocStatusCell',
  props: {
    status: String,
  },
  setup(props) {
    const res = computed(() => {
      switch (props.status) {
        case 'accepted':
          return {
            text: 'Приняты',
            color: 'green',
          }
        case 'needFix':
          return {
            text: 'На исправлении',
            color: 'orange',
          }
        case 'onCheck':
          return {
            text: 'На проверке',
            color: 'blue',
          }
        case 'missing':
          return {
            text: 'Не получены',
            color: 'red',
          }
        default:
          return ''
      }
    })
    return { res }
  },
}
</script>
<style scoped>
.statusWrapper {
  font-weight: bold;
  text-align: center;
  color: red;
}
</style>
