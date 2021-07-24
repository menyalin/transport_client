<template>
  <v-app-bar
    app
    color="primary"
    dense
    dark
  >
    <v-app-bar-nav-icon />
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <v-spacer />

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
  },
}
</script>
