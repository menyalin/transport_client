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
    <v-divider />
    <v-list
      nav
      dense
    >
      <v-list-item-group
        v-model="selectedItem"
        color="primary"
      >
        <v-list-item
          v-for="item in menuItems"
          :key="item.link"
          :to="item.link"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.text" />
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'LeftAdminNav',
  props: {
    items: {
      type: Array,
    },
  },
  data: () => ({
    selectedItem: 0,
  }),
  computed: {
    ...mapState({
      user: (state) => state.AuthModule.user,
    }),
    menuItems() {
      return this.items
        .filter(
          (i) =>
            !i.onlyWithDirectoriesProfile ||
            !!this.$store.getters.directoriesProfile
        )
        .filter((i) =>
          i.permission
            ? this.$store.getters.userRoles.includes('admin') ||
              this.$store.getters.permissionsMap.get(i.permission)
            : true
        )
    },
  },
}
</script>
<style></style>
