<template>
  <v-navigation-drawer permanent>
    <v-list density="compact">
      <v-list-item>
        <v-list-item-title class="text-h6 text-center">
          {{ user?.name }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ user?.email }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
    <v-divider />

    <v-list density="compact">
      <v-list-item
        v-for="item in menuItems"
        :key="item.link"
        :value="item"
        color="primary"
        :to="item.link"
      >
        <template #prepend>
          <v-icon :icon="item.icon" />
        </template>

        <v-list-item-title>
          {{ item.text }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
//@ts-nocheck
import { computed } from 'vue'
import { useStore } from 'vuex'

interface MenuItem {
  link: string
  text: string
  icon: string
  badge?: number
  permission?: string
  onlyWithDirectoriesProfile?: boolean
}

interface Props {
  items: MenuItem[]
}

const props = defineProps<Props>()

const store = useStore()
const user = computed(() => store.state.AuthModule.user)

const menuItems = computed(() => {
  return props.items
    .filter(
      (item) =>
        !item.onlyWithDirectoriesProfile || !!store.getters.directoriesProfile
    )
    .filter((item) =>
      item.permission
        ? store.getters.userRoles.includes('admin') ||
          store.getters.permissionsMap.get(item.permission)
        : true
    )
})

defineOptions({
  name: 'LeftAdminNav',
})
</script>

<style scoped>
/* Добавьте здесь стили, если необходимо */
</style>
