<template>
  <span>
    {{ `Погрузка: ${addressMap.get(item.loading).shortName}, зоны до ${distances} км.` }}
  </span>
</template>
<script setup>
import { computed } from 'vue'
import { useAddressStore } from '@/entities/address'

defineOptions({ name: 'DirectDistanceZones' })

const props = defineProps({
  item: Object,
})

const addressStore = useAddressStore()

const distances = computed(() => props.item.zones.map((i) => i.distance).join(', '))

const addressMap = computed(() => addressStore.addressMap)
</script>
<style />
