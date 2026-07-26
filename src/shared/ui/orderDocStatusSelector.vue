<template>
  <v-select v-bind="$attrs" v-model="value" :items="items" />
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { ORDER_DOC_STATUSES } from '@/shared/constants'

defineOptions({ name: 'OrderDocStatusSelector' })
const items = ref(ORDER_DOC_STATUSES)
const value = defineModel<string>()
</script>
