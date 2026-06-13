<template>
  <app-bar :title="title">
    <template v-if="hasLeftNav" #prepend>
      <v-btn icon @click="layoutStore.toggleLeftNav">
        <v-icon>{{ layoutStore.isLeftNavCollapsed ? 'mdi-menu' : 'mdi-menu-open' }}</v-icon>
      </v-btn>
    </template>
    <template #toolbar />
  </app-bar>
  <v-main>
    <app-left-nav v-if="hasLeftNav" :items="navItems" :collapsed="layoutStore.isLeftNavCollapsed" />

    <div class="layout-content" :class="{ 'nav-collapsed': layoutStore.isLeftNavCollapsed }">
      <slot />
    </div>

    <app-snackbar />
  </v-main>
</template>

<script setup>
import { computed } from 'vue'
import AppBar from '@/shared/ui/appBar/index.vue'
import AppSnackbar from '@/modules/common/components/appSnackbar/index.vue'
import AppLeftNav from '@/modules/common/components/leftNav/index.vue'
import { useLayoutStore } from '@/shared/stores/useLayoutStore'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  navItems: {
    type: Array,
    default: () => [],
  },
})

const layoutStore = useLayoutStore()
const hasLeftNav = computed(() => props.navItems?.length > 0)
</script>

<style scoped>
.layout-container {
  display: flex;
  align-items: stretch;
  height: 100%;
}

.layout-content {
  flex: 1;
  overflow: auto;
}

.layout-content.nav-collapsed {
  max-width: calc(100% - 56px);
}
</style>
