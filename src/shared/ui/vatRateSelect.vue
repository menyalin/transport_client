<template>
  <v-select v-bind="$attrs" v-model="value" :label="$attrs.label || 'Ставка НДС'" :items="items" />
</template>

<script setup>
import { VAT_RATE_ITEMS } from '@/shared/constants'

const value = defineModel()

const items = VAT_RATE_ITEMS
</script>
