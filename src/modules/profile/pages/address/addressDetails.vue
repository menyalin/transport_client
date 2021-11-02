<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div v-if="loading">
          Загружаю адрес...
        </div>
        <app-address-form
          v-else
          :address="formCache ? formCache : address"
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
import addressService from '../../services/address.service'
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'
import cacheFormMixin from '@/modules/common/mixins/cacheFormMixin'

export default {
  name: 'AddressDetails',
  components: {
    AppAddressForm,
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
      address: null,
    }
  },
  computed: {
    formName() {
      return `detailsPartner:${this.id}`
    },
  },
  async created() {
    this.loading = true
    this.address = await addressService.getById(this.id)
    this.loading = false
  },
  methods: {
    async submit(val) {
      this.loading = true
      this.address = await addressService.updateOne(this.id, val)
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
        await addressService.deleteById(this.id)
        this.loading = false
        this.clearCache()
        this.$router.go(-1)
      }
    },
  },
}
</script>
<style></style>
