<template>
  <span>
    Рейс:
    <b>{{ orderTypeStr }}</b
    >, Кол-во точек: <b> {{ item.includedPoints }}</b>
  </span>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'AdditionalPointsColumn',
  props: {
    item: Object,
  },
  computed: {
    orderTypeStr() {
      return this.$store.getters.orderAnalyticTypesMap.get(this.item.orderType)
    },
  },
})
</script>
<style />
