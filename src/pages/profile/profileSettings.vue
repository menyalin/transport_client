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
        <div v-if="user" class="mt-3">
          <h4>Выбрать профиль компании:</h4>
          <v-select
            class="ma-4"
            solo
            :value="directoriesProfile"
            :items="companies"
            clearable
            label="Профиль компании"
            @change="changeDirectoriesProfile"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import AppCompanyInvites from '@/widgets/companyInvites' // TODO: переместить в entity
import AppUserInfo from '@/widgets/userInfo' // TODO: переместить в entity

export default {
  name: 'ProfileSettingsPage',
  components: {
    AppCompanyInvites,
    AppUserInfo,
  },
  computed: {
    ...mapGetters([
      'myCompanies',
      'directoriesProfile',
      'companyInvites',
      'user',
    ]),
    companies() {
      return (
        this.myCompanies
          // .filter((item) => item.hasOwnDirectories)
          .map((item) => ({
            value: item._id,
            text: item.name,
          }))
      )
    },
  },
  methods: {
    async changeDirectoriesProfile(val) {
      await this.$store.dispatch('configProfile', { directoriesProfile: val })
      localStorage.clear()
      sessionStorage.clear()
      this.$store.commit('clearDirectories')
      if (val) await this.$store.dispatch('getUserData')
    },
  },
}
</script>
<style></style>
