<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-route-sheet-form
          @submit="submit"
          @cancel="cancel"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppRouteSheetForm from '@/modules/profile/components/routeSheetForm'

export default {
  name: 'RouteSheetCreate',
  components: {
    AppRouteSheetForm,
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    submit(routeSheet) {
      this.loading = true
      this.$store
        .dispatch('createRouteSheet', routeSheet)
        .then(() => {
          this.loading = false
          this.$router.push({ name: 'RouteSheetList' })
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
