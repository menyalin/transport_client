<template>
  <v-app>
    <app-admin-bar title="Home page" />
    <v-main>
      <v-container fluid>
        <v-row>
          <v-col>
            <div v-if="isLoggedIn && user">
              <div class="ma-5">
                Пользователь: {{ user.name }} {{ user.email }}
              </div>
              <v-divider />
              <div class="my-3">
                <router-link to="/profile"> Профиль пользователя </router-link>
              </div>
            </div>
            <div v-else class="text-center text-h3 ma-6">
              Необходима авторизация
            </div>
          </v-col>
        </v-row>
      </v-container>
      <app-snackbar />
    </v-main>
  </v-app>
</template>
<script>
import AppAdminBar from '@/modules/common/components/appBar'
import AppSnackbar from '@/modules/common/components/appSnackbar'
import { mapGetters } from 'vuex'

export default {
  name: 'ProfileLayout',
  components: {
    AppAdminBar,
    AppSnackbar,
  },
  data: () => ({}),
  computed: {
    ...mapGetters(['isLoggedIn', 'user']),
  },
  methods: {},
}
</script>
<style></style>
