<template>
  <v-navigation-drawer permanent>
    <v-list>
      <v-list-item>
        <v-list-item-title class="text-h6 center">
          {{ user ? user.name : null }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ user ? user.email : null }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
    <v-divider />
    <v-list nav mandatory>
      <v-badge
        v-for="(item, index) in menuItems"
        :key="item.link"
        color="error"
        :content="item.badge ? item.badge : null"
        :modelValue="item.badge ? item.badge : null"
        :style="{ width: '100%' }"
        offsetX="20"
        offsetY="10"
        
        bordered
      >
        <v-list-item :to="item.link" :title="item.text" :active="selectedItem === index"
@click="selectedItem = index">
          <template #prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
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
    },
  },
  data: () => ({
    selectedItem: 0,
  }),
  computed: {
    ...mapState({
      user: state => state.AuthModule.user,
    }),
    menuItems() {
      return this.items
        .filter(i => !i.onlyWithDirectoriesProfile || !!this.$store.getters.directoriesProfile)
        .filter(i =>
          i.permission
            ? this.$store.getters.userRoles.includes('admin') || this.$store.getters.permissionsMap.get(i.permission)
            : true
        )
    },
  },
}
</script>
<style></style>
