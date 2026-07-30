<template>
  <v-navigation-drawer
    :permanent="!collapsed"
    :temporary="false"
    :width="collapsed ? 45 : undefined"
  >
    <v-list v-if="!collapsed">
      <v-list-item>
        <v-list-item-title class="text-headline-small center">
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

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

defineOptions({ name: 'AppLeftNav' })

interface MenuItem {
  link: string
  icon: string
  text: string
  badge?: number
  onlyWithDirectoriesProfile?: boolean
  permission?: string
}

interface Props {
  items?: MenuItem[]
  collapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  collapsed: false,
})

const store = useStore()

const user = computed(() => store.state.AuthModule.user as { name: string; email: string } | null)
const selectedItem = ref<string>('')

const menuItems = computed(() => {
  return props.items
    .filter((i: MenuItem) => !i.onlyWithDirectoriesProfile || !!store.getters.directoriesProfile)
    .filter((i: MenuItem) =>
      i.permission
        ? store.getters.userRoles.includes('admin') ||
          store.getters.permissionsMap.get(i.permission)
        : true
    )
})
</script>

<style scoped>
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
