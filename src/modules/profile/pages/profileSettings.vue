<template>
  <v-container>
    <v-row>
      <v-col>
        <div>
          Использовать справочники компании:
          <v-select
            solo
            :value="directoriesProfile"
            :items="companies"
            @change="changeDirectoriesProfile"
            clearable
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ProfileSettingsPage',
  computed: {
    ...mapGetters(['myCompanies', 'directoriesProfile']),
    companies() {
      return this.myCompanies
        .filter((item) => item.hasOwnDirectories)
        .map((item) => ({
          value: item._id,
          text: item.name,
        }))
    },
  },
  methods: {
    changeDirectoriesProfile(val) {
      this.$store.dispatch('configProfile', { directoriesProfile: val })
    },
  },
}
</script>
<style></style>
