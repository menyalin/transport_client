<template>
  <PageLayout title="Admin panel" :nav-items="navButtons">
    <router-view />
  </PageLayout>
</template>

<script setup>
defineOptions({ name: 'AdminLayout' })
import { PageLayout } from '@/shared/ui'

const navButtons = [
  { text: 'Users', icon: 'mdi-account-multiple', link: '/admin/users' },
  { text: 'Companies', icon: 'mdi-star', link: '/admin/companies' },
  { text: 'Contracts', icon: 'mdi-history', link: '/admin/contracts' },
  { text: 'Обнволение рейсов', icon: 'mdi-history', link: '/admin/orders' },
]
</script>

<style scoped></style>
