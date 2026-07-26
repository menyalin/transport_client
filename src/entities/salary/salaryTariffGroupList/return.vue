<template>
  <span v-if="item.type === 'return'">
    Рейс: <b>{{ orderTypeStr }}</b> Паллеты:
    <b>{{ item.isPltReturn ? 'Да' : 'Нет' }}</b>
  </span>
</template>
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

defineOptions({ name: 'ReturnColumn' })

const props = defineProps({
  item: Object,
})

const store = useStore()

const orderTypeStr = computed(() => store.getters.orderAnalyticTypesMap.get(props.item.orderType))
</script>
