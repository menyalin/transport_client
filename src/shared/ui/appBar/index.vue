<template>
  <v-app-bar color="primary" density="compact">
    <v-img
      src="/logo.svg"
      height="40"
      max-height="20"
      max-width="20"
      :style="{ margin: '0px 15px' }"
    />
    <slot name="prepend" />
    <ScheduleSettings v-if="$route.name === 'Schedule'" />
    <v-toolbar-title class="app-title">
      {{ title || 's4log' }}
    </v-toolbar-title>
    <slot name="toolbar" />
    <v-spacer />
    <v-btn v-if="isLoggedIn && directoriesProfile" :to="{ name: 'Schedule' }" variant="text">
      <v-icon start> mdi-pac-man </v-icon>
      Распределение
    </v-btn>
    <v-btn v-if="isLoggedIn && directoriesProfile" to="/orders" variant="text">
      <v-icon start> mdi-truck-fast </v-icon>
      Рейсы
    </v-btn>
    <AppReportsMenu v-if="isLoggedIn && directoriesProfile" />
    <v-btn v-if="isLoggedIn" to="/profile" variant="text">
      <v-icon start> mdi-account-outline </v-icon>
      Профиль
    </v-btn>
    <v-btn v-if="showAccountingModule" variant="text" to="/accounting">
      <v-icon start> mdi-calculator-variant </v-icon>
      Учет
    </v-btn>
    <v-btn v-if="showAdminModule" to="/admin" variant="text"> Админка </v-btn>
    <v-btn v-if="!isLoggedIn" icon to="/auth/login">
      <v-icon>mdi-import</v-icon>
    </v-btn>

    <v-btn v-else icon @click="logoutClick">
      <v-icon>mdi-export</v-icon>
    </v-btn>
  </v-app-bar>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import AppReportsMenu from './reportsMenu.vue'
import ScheduleSettings from '@/entities/order/scheduleSetting/index.vue'

export default {
  name: 'AppBarIndex',
  components: {
    AppReportsMenu,
    ScheduleSettings,
  },
  props: {
    title: {
      type: String,
    },
    reports: {
      type: Array,
    },
  },
  computed: {
    ...mapGetters(['user', 'isLoggedIn', 'directoriesProfile']),
    showAccountingModule() {
      return this.$store.getters.hasPermission('modules:accounting')
    },
    showAdminModule() {
      return this.isLoggedIn && !!this.$store.getters.user.isAdmin
    },
  },
  methods: {
    ...mapActions(['logOut']),
    logoutClick() {
      this.logOut()
    },
  },
}
</script>
<style scoped>
.app-title {
  cursor: pointer;
}
</style>
