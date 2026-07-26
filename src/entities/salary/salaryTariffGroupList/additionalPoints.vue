<template>
  <span>
    Рейс:
    <b>{{ orderTypeStr }}</b
    >, Кол-во точек: <b> {{ item.includedPoints }}</b>
  </span>
</template>
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

defineOptions({ name: 'AdditionalPointsColumn' })

const props = defineProps({
  item: Object,
})

const store = useStore()

const orderTypeStr = computed(() => store.getters.orderAnalyticTypesMap.get(props.item.orderType))
</script>
<style />
