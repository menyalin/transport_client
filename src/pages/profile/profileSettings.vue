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
        {{ directoriesProfile }}
        <div v-if="user" class="mt-3">
          <h4>Выбрать профиль компании:</h4>
          <v-select
            class="ma-4"
            :model-value="directoriesProfile"
            :items="companies"
            clearable
            @update:model-value="changeDirectoriesProfile"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'

import AppCompanyInvites from '@/widgets/companyInvites' // TODO: переместить в entity
import AppUserInfo from '@/widgets/userInfo' // TODO: переместить в entity

export default defineComponent({
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
            title: item.name,
          }))
      )
    },
  },
  methods: {
    async changeDirectoriesProfile(val) {
      await this.$store.dispatch('configProfile', { directoriesProfile: val })
      this.$store.commit('clearDirectories')
      if (val) await this.$store.dispatch('getUserData')
    },
  },
})
</script>
<style></style>
