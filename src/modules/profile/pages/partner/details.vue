<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-load-spinner v-if="loading" />

        <app-partner-form
          v-else
          :partner="formCache ? formCache : item"
          display-delete-btn
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
          @saveToCache="saveToCache"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppPartnerForm from '@/modules/profile/components/partnerForm'
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'
import service from '../../services/partner.service'
import cacheFormMixin from '@/modules/common/mixins/cacheFormMixin'

export default {
  name: 'PartnerDetails',
  components: {
    AppPartnerForm,
    AppLoadSpinner,
  },
  mixins: [cacheFormMixin],
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      service: service,
    }
  },
  computed: {
    formName() {
      return `PartnerDetails:${this.id}`
    },
  },

  methods: {
    async submit(val) {
      this.needFormCache = false
      this.loading = true
      this.item = await this.service.updateOne(this.id, val)
      this.loading = false
      this.clearCache()
      this.$router.go(-1)
    },
  },
}
</script>
<style></style>
