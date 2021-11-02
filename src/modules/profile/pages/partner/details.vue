<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-load-spinner v-if="loading" />

        <app-partner-form
          v-else
          :partner="formCache ? formCache : partner"
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
      loading: false,
      partner: null,
    }
  },
  computed: {
    formName() {
      return `detailsPartner:${this.id}`
    },
  },
  async created() {
    this.loading = true
    this.partner = await service.getById(this.id)
    this.loading = false
  },

  methods: {
    async submit(val) {
      this.loading = true
      this.partner = await service.updateOne(this.id, val)
      this.loading = false
      this.clearCache()
      this.$router.go(-1)
    },

    async deleteHandler() {
      const res = await this.$confirm(
        'Вы действительно хотите удалить запись? '
      )
      if (res) {
        this.loading = true
        await service.deleteById(this.id)
        this.clearCache()
        this.loading = false
        this.$router.go(-1)
      }
    },
  },
}
</script>
<style></style>
