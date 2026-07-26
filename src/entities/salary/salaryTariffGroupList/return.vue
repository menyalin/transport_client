<template>
  <span v-if="item.type === 'return'">
    Рейс: <b>{{ orderTypeStr }}</b> Паллеты:
    <b>{{ item.isPltReturn ? 'Да' : 'Нет' }}</b>
  </span>
</template>
<script setup>
import { computed } from 'vue'
import { useOrderStore } from '@/entities/order/orderStore'

defineOptions({ name: 'ReturnColumn' })

const props = defineProps({
  item: Object,
})

const orderStore = useOrderStore()

const orderTypeStr = computed(() => orderStore.orderAnalyticTypesMap.get(props.item.orderType))
</script>
