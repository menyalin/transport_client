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
import cacheFormMixin from '@/modules/common/mixins/cacheFormMixin'

export default {
  name: 'PartnerCreate',
  components: {
    AppPartnerForm,
  },
  mixins: [cacheFormMixin],
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
        .then((res) => {
          this.loading = false
          console.log(res._id)
          this.updateCache({
            value: res._id,
            formName: this.$route.params.formName,
            field: this.$route.params.field,
          })
          this.clearCache()
          this.$nextTick(() => {
            this.$router.go(-1)
          })
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
