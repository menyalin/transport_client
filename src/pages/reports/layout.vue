<template>
  <PageLayout title="Отчеты">
    <router-view />
  </PageLayout>
</template>

<script setup>
defineOptions({ name: 'ReportsLayout' })
import { PageLayout } from '@/shared/ui'
</script>

<style scoped></style>
