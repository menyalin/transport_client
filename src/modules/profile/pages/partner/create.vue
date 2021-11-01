<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-partner-form
          :loading="loading"
          :partner="formCache"
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
import cacheFormMixinBuilder from '@/modules/common/mixins/cacheFormMixinBuilder'

// const formMixin = cacheFormMixinBuilder()

export default {
  name: 'PartnerCreate',
  components: {
    AppPartnerForm,
  },
  mixins: [cacheFormMixinBuilder()],
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    formName() {
      return 'createPartner'
    },
  },
  methods: {
    submit(data) {
      this.loading = true
      this.$store
        .dispatch('createPartner', data)
        .then(() => {
          this.loading = false
          this.clearCache()
          this.$router.push({ name: 'PartnerList' })
        })
        .catch((e) => {
          this.loading = false
          this.$store.commit('setError', e)
        })
    },
  },
}
</script>
<style></style>
