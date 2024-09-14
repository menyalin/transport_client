<template>
  <div class="layout">
    <app-left-nav :items="navButtonsWithBadges" />
    <router-view />
    <app-snackbar />
  </div>
</template>
<script lang="ts">
//@ ts-nocheck
import { defineComponent } from 'vue'

import AppLeftNav from '@/modules/common/components/leftNav/index.vue'

export default defineComponent({
  name: 'ProfileLayout',
  components: {
    AppLeftNav,
  },
  data: () => ({
    navButtons: [
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
        link: '/profile/tk_names',
        onlyWithDirectoriesProfile: true,
        permission: 'tkName:readList',
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
    ],
  }),
  computed: {
    navButtonsWithBadges() {
      return this.navButtons.map((i) => {
        if (i.link === '/profile/settings')
          return { ...i, badge: this.$store.getters.companyInvites.length }
        else return i
      })
    },
  },
})
</script>
<style scoped>
.layout {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
}
</style>
