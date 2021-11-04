<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-load-spinner v-if="loading" />
        <app-address-form
          v-else
          :address="formCache ? formCache : item"
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
import AppAddressForm from '@/modules/profile/components/addressForm'
import service from '../../services/address.service'
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'
import cacheFormMixin from '@/modules/common/mixins/cacheFormMixin'

export default {
  name: 'AddressDetails',
  components: {
    AppAddressForm,
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
      return `AddressDetails:${this.id}`
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
