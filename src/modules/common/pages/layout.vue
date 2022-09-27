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
              <div class="ma-3">
                <router-link to="/profile">
                  Профиль пользователя
                </router-link>
              </div>
              <app-date-time-input 
                v-model="date1"
                min="2022-09-21"
                dense
                hide-details
                type="date"
                label="Инпут 1" 
              />
              date1: {{ date1 }}

              <app-date-time-input 
                v-model="date2"
                type="datetime-local"
                label="Инпут 2" 
              />
              date2: {{ date2 }}
            </div>
            <div
              v-else
              class="text-center text-h3 ma-6"
            >
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
import appDateTimeInput from '@/modules/common/components/dateTimeInput2'

export default {
  name: 'ProfileLayout',
  components: {
    AppAdminBar,
    AppSnackbar,
    appDateTimeInput,
  },
  data: () => ({
    date1: '2022-09-21T21:00:00.000Z',
    date2: '2022-09-23T15:00:00.000Z',
  }),
  computed: {
    ...mapGetters(['isLoggedIn', 'user']),
  },
  methods: {},
}
</script>
<style></style>
