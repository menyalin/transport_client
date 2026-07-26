<template>
  <PageLayout title="Профиль" :nav-items="navButtonsWithBadges">
    <router-view />
  </PageLayout>
</template>

<script setup>
defineOptions({ name: 'ProfileLayout' })
import { computed } from 'vue'
import { useStore } from 'vuex'
import { PageLayout } from '@/shared/ui'

const store = useStore()

const navButtons = [
  {
    text: 'Настройки профиля',
    icon: 'mdi-cog',
    link: '/profile/settings',
    onlyWithDirectoriesProfile: false,
  },
  {
    text: 'Компании',
    icon: 'mdi-factory',
    link: '/profile/companies',
    onlyWithDirectoriesProfile: false,
    permission: 'admin_only',
  },
  {
    text: 'Cотрудники',
    icon: 'mdi-account-hard-hat',
    link: '/profile/workers',
    onlyWithDirectoriesProfile: true,
    permission: 'worker:readList',
  },

  {
    text: 'Перевозчики',
    icon: 'mdi-alien',
    link: '/profile/carriers',
    onlyWithDirectoriesProfile: true,
    permission: 'carrier:readList',
  },
  {
    text: 'Адреса',
    icon: 'mdi-domain',
    link: '/profile/address',
    onlyWithDirectoriesProfile: true,
    permission: 'address:readList',
  },
  {
    text: 'Зоны',
    icon: 'mdi-map-marker',
    link: '/profile/zones',
    onlyWithDirectoriesProfile: true,
    permission: 'zone:readList',
  },
  {
    text: 'Регионы',
    icon: 'mdi-map-marker',
    link: '/profile/regions',
    onlyWithDirectoriesProfile: true,
    permission: 'region:readList',
  },
  {
    text: 'Города',
    icon: 'mdi-map-marker',
    link: '/profile/cities',
    onlyWithDirectoriesProfile: true,
    permission: 'city:readList',
  },
  {
    text: 'Простои/Выходные',
    icon: 'mdi-car-wrench',
    link: '/profile/downtimes',
    onlyWithDirectoriesProfile: true,
    permission: 'downtime:readList',
  },
  {
    text: 'Заметки в распределении',
    icon: 'mdi-note-multiple',
    link: '/profile/schedule_notes',
    onlyWithDirectoriesProfile: true,
    permission: 'scheduleNote:readList',
  },
  {
    text: 'Партнеры',
    icon: 'mdi-emoticon-devil',
    link: '/profile/partners',
    onlyWithDirectoriesProfile: true,
    permission: 'partner:readList',
  },
  {
    text: 'Экипажи',
    icon: 'mdi-cow',
    link: '/profile/crews',
    onlyWithDirectoriesProfile: true,
    permission: 'crew:readList',
  },
  {
    text: 'Транспорт',
    icon: 'mdi-truck',
    link: '/profile/trucks',
    onlyWithDirectoriesProfile: true,
    permission: 'truck:readList',
  },
  {
    text: 'Водители',
    icon: 'mdi-sheep',
    link: '/profile/drivers',
    onlyWithDirectoriesProfile: true,
    permission: 'driver:readList',
  },
  {
    text: 'Штрафы',
    icon: 'mdi-truck-alert',
    link: '/profile/fines',
    onlyWithDirectoriesProfile: true,
    permission: 'fine:readList',
  },
  {
    text: 'Шаблоны рейсов',
    icon: 'mdi-receipt',
    link: '/profile/order_templates',
    onlyWithDirectoriesProfile: true,
    permission: 'orderTemplate:readList',
  },
]

const navButtonsWithBadges = computed(() => {
  return navButtons.map((i) => {
    if (i.link === '/profile/settings') return { ...i, badge: store.getters.companyInvites.length }
    else return i
  })
})
</script>

<style scoped></style>
