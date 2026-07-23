<template>
  <div class="statusWrapper" :style="{ color: res.color }">{{ res.text }}</div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'DocStatusCell' })

const props = defineProps({
  status: String,
})

const res = computed(() => {
  switch (props.status) {
    case 'accepted':
      return { text: 'Приняты', color: 'green' }
    case 'needFix':
      return { text: 'На исправлении', color: 'orange' }
    case 'onCheck':
      return { text: 'На проверке', color: 'blue' }
    case 'missing':
      return { text: 'Не получены', color: 'red' }
    default:
      return { text: '', color: '' }
  }
})
</script>

<style scoped>
.statusWrapper {
  font-weight: bold;
  text-align: center;
  color: red;
}
</style>
