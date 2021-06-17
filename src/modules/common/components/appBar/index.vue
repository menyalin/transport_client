<template>
  <v-app-bar app color="primary" dense dark>
    <v-app-bar-nav-icon></v-app-bar-nav-icon>
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <v-spacer />

    <v-btn icon @click="logoutClick">
      <v-icon>mdi-export</v-icon>
    </v-btn>
  </v-app-bar>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  props: {
    title: {
      type: String,
      required: true,
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
