<template>
  <v-select v-bind="$attrs" v-model="value" :label="$attrs.label || 'Ставка НДС'" :items="items" />
</template>

<script setup lang="ts">
import { VAT_RATE_ITEMS } from '@/shared/constants'

const value = defineModel<number | string>()

const items = VAT_RATE_ITEMS
</script>
