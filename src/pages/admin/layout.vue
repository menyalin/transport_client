<template>
  <v-container fluid>
    <v-row>
      <v-col cols="auto">
        <app-left-nav :items="navButtons" />
      </v-col>
      <v-col>
        <router-view />
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import AppLeftNav from '@/modules/common/components/leftNav/index.vue'

export default defineComponent({
  name: 'AdminLayout',
  components: {
    AppLeftNav,
  },
  data: () => ({
    navButtons: [
      { text: 'Users', icon: 'mdi-account-multiple', link: '/admin/users' },
      { text: 'Companies', icon: 'mdi-star', link: '/admin/companies' },
      { text: 'Contracts', icon: 'mdi-history', link: '/admin/contracts' },
      { text: 'Обнволение рейсов', icon: 'mdi-history', link: '/admin/orders' },
    ],
  }),
})
</script>
<style></style>
