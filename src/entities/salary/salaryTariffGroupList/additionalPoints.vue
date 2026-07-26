<template>
  <span>
    Рейс:
    <b>{{ orderTypeStr }}</b
    >, Кол-во точек: <b> {{ item.includedPoints }}</b>
  </span>
</template>
<script setup>
import { computed } from 'vue'
import { useOrderStore } from '@/entities/order/orderStore'

defineOptions({ name: 'AdditionalPointsColumn' })

const props = defineProps({
  item: Object,
})

const orderStore = useOrderStore()

const orderTypeStr = computed(() => orderStore.orderAnalyticTypesMap.get(props.item.orderType))
</script>
<style />
