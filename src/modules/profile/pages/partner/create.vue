<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-partner-form
          :loading="loading"
          @submit="submit"
          @cancel="cancel"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppPartnerForm from '@/modules/profile/components/partnerForm'

export default {
  name: 'PartnerCreate',
  components: {
    AppPartnerForm,
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    submit(data) {
      this.loading = true
      this.$store
        .dispatch('createPartner', data)
        .then(() => {
          this.loading = false
          this.$router.push({ name: 'PartnerList' })
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
