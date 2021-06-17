<template>
  <v-app>
    <app-admin-bar title="User profile" />
    <v-main>
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
    </v-main>
  </v-app>
</template>
<script>
import AppAdminBar from '@/modules/common/components/appBar'
import AppLeftNav from '@/modules/common/components/leftNav'

export default {
  name: 'profileLayout',
  components: {
    AppAdminBar,
    AppLeftNav,
  },
  data: () => ({
    navButtons: [
      { text: 'Companies', icon: 'mdi-factory', link: '/profile/companies' },
    ],
  }),
}
</script>
<style></style>
