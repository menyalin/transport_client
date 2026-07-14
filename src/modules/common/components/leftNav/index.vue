<template>
  <v-navigation-drawer
    :permanent="!collapsed"
    :temporary="false"
    :width="collapsed ? 45 : undefined"
  >
    <v-list v-if="!collapsed">
      <v-list-item>
        <v-list-item-title class="text-h6 center">
          {{ user ? user.name : null }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ user ? user.email : null }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
    <v-divider v-if="!collapsed" />
    <v-list selected-color="primary" nav>
      <v-badge
        v-for="item in menuItems"
        :key="item.link"
        color="error"
        :content="item.badge"
        :model-value="!!item.badge"
        offset-x="20"
        offset-y="10"
        bordered
      >
        <v-list-item
          :to="item.link"
          :prepend-icon="item.icon"
          :active="selectedItem === item.link"
          :value="item.link"
          @click="selectedItem = item.link"
        >
          <v-list-item-title v-if="!collapsed" v-text="item.text" />
        </v-list-item>
      </v-badge>
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
      default: () => [],
    },
    collapsed: {
      type: Boolean,
      default: false,
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
        .filter((i) => !i.onlyWithDirectoriesProfile || !!this.$store.getters.directoriesProfile)
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

<style scoped>
/* При сворачивании скрываем текст, оставляем только иконки */
.v-navigation-drawer :deep(.v-list-item-title) {
  transition: opacity 0.2s;
}

.v-navigation-drawer :deep(.v-badge) {
  display: flex;
  width: 100%;
}

.v-navigation-drawer :deep(.v-badge > .v-list-item) {
  width: 100%;
}
</style>
