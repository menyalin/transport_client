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
                <router-link to="/profile">Профиль пользователя</router-link>
              </div>
              <div class="ma-3">
                <router-link to="/admin">Админка</router-link>
              </div>
              <v-divider />
              <div>
                входные данные: {{ dateStr }}
                <app-date-time-input
                  v-model="dateStr"
                  label="Обычная строка даты"
                  class="mb-4"
                  hideTimeInput
                />
                <v-divider></v-divider>
                входные данные: {{ dateFromServer }}
                <app-date-time-input
                  v-model="dateFromServer"
                  label="Дата с временем с сервера"
                  class="mb-4"
                />
                <v-divider></v-divider>
                входные данные: {{ dateFromServer2 }}
                <app-date-time-input
                  v-model="dateFromServer2"
                  label="Дата без времени с сервера"
                  class="mb-4"
                />
                <v-divider></v-divider>
                входные данные: {{ dateFromServer3 }}
                <app-date-time-input
                  v-model="dateFromServer3"
                  label="Дата без времени с сервера"
                  class="mb-4"
                />
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
import AppDateTimeInput from '@/modules/common/components/dateTimeInput'
import { mapGetters } from 'vuex'

export default {
  name: 'profileLayout',
  data: () => ({
    dateStr: '2021-07-06 ',
    dateFromServer: '2021-06-12T14:21:45.075Z',
    dateFromServer2: '2021-06-01T00:00:00.000Z',
    dateFromServer3: '2021-07-08T16:57:01+03:00',
  }),
  components: {
    AppAdminBar,
    AppSnackbar,
    AppDateTimeInput,
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'user']),
  },
  methods: {
    createError() {
      this.$store.commit('setError', 'Ошибка!!"')
    },
  },
}
</script>
<style></style>
