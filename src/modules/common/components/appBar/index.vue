<template>
  <v-app-bar app color="primary" dark dense>
    <v-app-bar-nav-icon />
    <v-img
      src="/logo.svg"
      height="40"
      max-height="20"
      max-width="20"
      class="mx-3"
    />
    <v-toolbar-title class="app-title" @click="toHomePage">
      {{ title || 's4log' }}
    </v-toolbar-title>
    <slot />
    <v-spacer />
    <v-btn
      v-if="isLoggedIn && directoriesProfile"
      :to="{ name: 'Schedule' }"
      text
    >
      <v-icon left> mdi-pac-man </v-icon>
      Распределение
    </v-btn>
    <v-btn v-if="isLoggedIn && directoriesProfile" to="/orders" text>
      <v-icon left> mdi-truck-fast </v-icon>
      Рейсы
    </v-btn>
    <app-reports-menu v-if="isLoggedIn && directoriesProfile" />
    <v-btn v-if="isLoggedIn" to="/profile" text>
      <v-icon left> mdi-account-outline </v-icon>
      Профиль
    </v-btn>
    <v-btn v-if="showAccountingModule" text to="/accounting">
      <v-icon left> mdi-calculator-variant </v-icon>
      Учет
    </v-btn>
    <v-btn v-if="showAdminModule" to="/admin" text> Админка </v-btn>
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

export default {
  components: {
    AppReportsMenu,
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
    toHomePage() {
      if (this.$route.path !== '/') this.$router.push('/')
    },
  },
}
</script>
<style scoped>
.app-title {
  cursor: pointer;
}
</style>
