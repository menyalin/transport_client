<template>
  <page-layout :title="title">
    <template #toolbar>
      <schedule-settings v-if="$route.fullPath === '/schedule/'" />
    </template>

    <router-view />
  </page-layout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { PageLayout } from '@/shared/ui'
import { ScheduleSettings } from '@/entities/order'

const route = useRoute()

const title = computed(() => {
  if (route.path.startsWith('/schedule')) return 'Распределение'
  if (route.path.startsWith('/orders')) return 'Рейсы'
  return ''
})
</script>

<style scoped></style>
