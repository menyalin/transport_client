<template>
  <PageLayout :title="title">
    <router-view />
  </PageLayout>
</template>

<script setup>
defineOptions({ name: 'OrdersLayout' })
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
