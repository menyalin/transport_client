<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-load-spinner v-if="loading" />
        <app-partner-form
          v-else
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
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'
import cacheFormMixin from '@/modules/common/mixins/cacheFormMixin'

export default {
  name: 'PartnerCreate',
  components: {
    AppPartnerForm,
    AppLoadSpinner,
  },
  mixins: [cacheFormMixin],
  props: {
    initFormName: String,
    fieldName: String,
  },

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
          this.needFormCache = false
          this.loading = false
          this.updateCache({
            value: res._id,
            formName: this.initFormName,
            fieldName: this.fieldName,
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
