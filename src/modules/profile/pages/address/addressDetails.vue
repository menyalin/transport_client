<template>
  <v-container>
    <v-row>
      <v-col>
        <div v-if="loading">Загружаю адрес...</div>
        <app-address-form
          v-else
          @cancel="cancel"
          :address="address"
          @submit="submit"
          displayDeleteBtn
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppAddressForm from '@/modules/profile/components/addressForm'
import addressService from '../../services/address.service'
export default {
  name: 'AddressDetails',
  components: {
    AppAddressForm,
  },
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

  methods: {
    async submit(val) {
      this.loading = true
      this.address = await addressService.updateOne(this.id, val)
      this.loading = false
      this.$router.go(-1)
    },
    cancel() {
      this.$router.push({ name: 'AddressList' })
    },
    async deleteHandler() {
      this.loading = true
      await addressService.deleteById(this.id)
      this.loading = false
      this.$router.go(-1)
    },
  },
  async created() {
    this.loading = true
    this.address = await addressService.getById(this.id)
    this.loading = false
  },
}
</script>
<style></style>
