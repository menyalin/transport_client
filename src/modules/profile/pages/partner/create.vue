<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-partner-form
          :loading="loading"
          :needFormCache="needFormCache"
          @submit="submit"
          @saveToCache="saveToCache"
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
      needFormCache: false,
    }
  },
  beforeRouteLeave(to, from, next) {
    console.log('need form cache')
    this.needFormCache = true
    this.$$nextTick(() => {
      next()
    })
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
    saveToCache(val) {
      console.log('val')
    },
    cancel() {
      this.$router.go(-1)
    },
  },
}
</script>
<style></style>
