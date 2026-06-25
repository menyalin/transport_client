<template>
  <page-layout :title="title">
    <router-view />
  </page-layout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { PageLayout } from '@/shared/ui'

const route = useRoute()

const title = computed(() => {
  if (route.path.startsWith('/schedule')) return 'Распределение'
  if (route.path.startsWith('/orders')) return 'Рейсы'
  return ''
})
</script>

<style scoped></style>
