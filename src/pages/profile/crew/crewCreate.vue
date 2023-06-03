<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-crew-form
          :loading="loading"
          :crew="crew.tkName ? crew : null"
          :disabledSubmit="!$store.getters.hasPermission('crew:write')"
          @submit="submit"
          @cancel="cancel"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppCrewForm from '@/modules/profile/components/crewForm'

export default {
  name: 'CrewCreate',
  components: {
    AppCrewForm,
  },
  data() {
    return {
      loading: false,
      crew: {
        tkName: null,
        truck: null,
        trailer: null,
        driver: null,
      },
    }
  },
  created() {
    if (this.$route.params.tkName) {
      this.crew.tkName = this.$route.params.tkName
      this.crew.truck = this.$route.params.truck
      this.crew.trailer = this.$route.params.trailer
      this.crew.driver = this.$route.params.driver
    }
  },
  methods: {
    submit(item) {
      this.loading = true
      this.$store
        .dispatch('createCrew', item)
        .then(() => {
          this.loading = false
          this.$router.push({ name: 'CrewList' })
        })
        .catch((e) => {
          this.loading = false
          this.$store.commit('setError', e)
        })
    },
    cancel() {
      this.$router.go(-1)
    },
  },
}
</script>
<style></style>
