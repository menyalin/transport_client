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
              <div class="ma-3">
                <router-link to="/admin">
                  Админка
                </router-link>
              </div>
            </div>
            <div
              v-else
              class="text-center text-h3 ma-6"
            >
              Необходима авторизация
            </div>
            partnerValue: {{ partnerValue }}

            <app-autocomplete
              v-model="partnerValue"
              label="Партнер"
              items-getter="partnersForAutocomplete"
            >
              <template v-slot:form>
                <app-partner-form />
              </template>
            </app-autocomplete>
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
import AppAutocomplete from '@/modules/common/components/autocomplete'
import AppPartnerForm from '@/modules/profile/components/partnerForm'
import { mapGetters } from 'vuex'

export default {
  name: 'ProfileLayout',
  components: {
    AppAdminBar,
    AppSnackbar,
    AppAutocomplete,
    AppPartnerForm,
  },
  data: () => ({
    partnerValue: '617bbc1e70a11d01eb72f022',
  }),
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
