<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-user-info />
        <app-company-invites
          v-if="companyInvites.length" 
          class="my-3" 
          :invites="companyInvites"
        />
        <div class="mt-3">
          <h4>Использовать справочники компании:</h4>
          <v-select
            class="ma-4"
            solo
            :value="directoriesProfile"
            :items="companies"
            clearable
            label="Выбор профиля справочников"
            @change="changeDirectoriesProfile"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import AppCompanyInvites from '../components/companyInvites/index.vue'
import AppUserInfo from '../components/userInfo/index.vue'

export default {
  name: 'ProfileSettingsPage',
  components: {
    AppCompanyInvites,
    AppUserInfo,
  },
  computed: {
    ...mapGetters(['myCompanies', 'directoriesProfile', 'companyInvites']),
    companies() {
      return this.myCompanies
        // .filter((item) => item.hasOwnDirectories)
        .map((item) => ({
          value: item._id,
          text: item.name,
        }))
    },
  },
  methods: {
    async changeDirectoriesProfile(val) {
      await this.$store.dispatch('configProfile', { directoriesProfile: val })
      this.$store.commit('clearDirectories')
      if (val) await this.$store.dispatch('getUserData')
    },
  },
}
</script>
<style></style>
