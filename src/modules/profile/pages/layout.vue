<template>
  <v-app>
    <app-admin-bar title="User profile" />
    <v-main>
      <div class="layout">
        <app-left-nav :items="navButtons" />
        <router-view />
      </div>
      <app-snackbar />
    </v-main>
  </v-app>
</template>
<script>
import AppAdminBar from '@/modules/common/components/appBar'
import AppLeftNav from '@/modules/common/components/leftNav'
import AppSnackbar from '@/modules/common/components/appSnackbar'

export default {
  name: 'ProfileLayout',
  components: {
    AppAdminBar,
    AppLeftNav,
    AppSnackbar,
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
        text: 'Перевозчики',
        icon: 'mdi-alien',
        link: '/profile/tk_names',
        onlyWithDirectoriesProfile: true,
      },
      {
        text: 'Адреса',
        icon: 'mdi-domain',
        link: '/profile/address',
        onlyWithDirectoriesProfile: true,
      },
      {
        text: 'Простои/Выходные',
        icon: 'mdi-car-wrench',
        link: '/profile/downtimes',
        onlyWithDirectoriesProfile: true,
      },
      {
        text: 'Заметки в распределении',
        icon: 'mdi-note-multiple',
        link: '/profile/schedule_notes',
        onlyWithDirectoriesProfile: true,
      },
      {
        text: 'Партнеры',
        icon: 'mdi-emoticon-devil',
        link: '/profile/partners',
        onlyWithDirectoriesProfile: true,
      },
      {
        text: 'Экипажи',
        icon: 'mdi-cow',
        link: '/profile/crews',
        onlyWithDirectoriesProfile: true,
      },
      {
        text: 'Транспорт',
        icon: 'mdi-truck',
        link: '/profile/trucks',
        onlyWithDirectoriesProfile: true,
      },
      {
        text: 'Водители',
        icon: 'mdi-card-account-details',
        link: '/profile/drivers',
        onlyWithDirectoriesProfile: true,
      },
      {
        text: 'Шаблоны рейсов',
        icon: 'mdi-receipt',
        link: '/profile/order_templates',
        onlyWithDirectoriesProfile: true,
      },
      {
        text: 'Задачи',
        icon: 'mdi-message-reply-text',
        link: '/profile/tasks',
        onlyWithDirectoriesProfile: false,
      },
    ],
  }),
}
</script>
<style scoped>
.layout {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
}
</style>
