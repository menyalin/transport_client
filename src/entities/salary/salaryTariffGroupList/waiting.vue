<template>
  <span>
    Рейс: <b>{{ orderTypeStr }}</b> , тариф за: <b>{{ waitingTariffBy }}</b>
  </span>
</template>
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useOrderStore } from '@/entities/order/orderStore'

defineOptions({ name: 'WaitingColumn' })

const props = defineProps({
  item: Object,
})

const store = useStore()
const orderStore = useOrderStore()

const orderTypeStr = computed(() => orderStore.orderAnalyticTypesMap.get(props.item.orderType))

const waitingTariffBy = computed(() =>
  store.getters.waitingTariffByItemsMap.get(props.item.tariffBy)
)
</script>
<style></style>
