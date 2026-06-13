<template>
  <error-page
    alert-type="error"
    message="Доступ к запрашиваемой странице запрещён"
    :redirect-path="route.query.redirect || '/'"
  />
</template>

<script setup>
import { ErrorPage } from '@/shared/ui'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped></style>
