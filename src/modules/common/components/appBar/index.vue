<template>
  <v-app-bar
    app
    color="primary"
    dark
    dense
  >
    <v-app-bar-nav-icon />
    <v-toolbar-title
      class="app-title"
      @click="toHomePage"
    >
      s4log
    </v-toolbar-title>
    <v-spacer />
    <v-btn
      v-if="isLoggedIn"
      :to="{ name: 'Schedule' }"
      text
    >
      <v-icon left>
        mdi-pac-man
      </v-icon>
      Распределение
    </v-btn>
    <v-btn
      v-if="isLoggedIn"
      to="/orders"
      text
    >
      <v-icon left>
        mdi-truck-fast
      </v-icon>
      Рейсы
    </v-btn>
    <v-btn
      v-if="isLoggedIn"
      to="/profile"
      text
    >
      <v-icon left>
        mdi-account-outline
      </v-icon>
      Профиль
    </v-btn>
    <v-btn
      v-if="isLoggedIn"
      to="/admin"
      text
    >
      Админка
    </v-btn>
    <v-btn
      v-if="!isLoggedIn"
      icon
      to="/auth/login"
    >
      <v-icon>mdi-import</v-icon>
    </v-btn>

    <v-btn
      v-else
      icon
      @click="logoutClick"
    >
      <v-icon>mdi-export</v-icon>
    </v-btn>
  </v-app-bar>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['user', 'isLoggedIn']),
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
