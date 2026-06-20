<template>
  <span>
    {{ `Погрузка: ${addressMap.get(item.loading).shortName}, зоны до ${distances} км.` }}
  </span>
</template>
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

defineOptions({ name: 'DirectDistanceZones' })

const props = defineProps({
  item: Object,
})

const store = useStore()

const distances = computed(() => props.item.zones.map((i) => i.distance).join(', '))

const addressMap = computed(() => store.getters.addressMap)
</script>
<style />
