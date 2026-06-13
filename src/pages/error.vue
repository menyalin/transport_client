<template>
  <error-page
    alert-type="error"
    :message="route.query.message || 'Сервер недоступен'"
    redirect-path="/"
  />
</template>

<script setup>
import { ErrorPage } from '@/shared/ui'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped></style>
