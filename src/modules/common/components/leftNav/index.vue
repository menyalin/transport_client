<template>
  <v-navigation-drawer permanent>
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6 center">
            {{ user ? user.name : null }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ user ? user.email : null }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list nav dense>
      <v-list-item-group v-model="selectedItem" color="primary">
        <v-list-item v-for="item in items" :key="item.link" :to="item.link">
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'leftAdminNav',
  computed: {
    ...mapState({
      user: (state) => state.AuthModule.user,
    }),
  },
  props: {
    items: {
      type: Array,
    },
  },
  data: () => ({
    selectedItem: 0,
  }),
}
</script>
<style></style>
