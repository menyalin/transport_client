<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-load-spinner v-if="loading" />
        <app-address-form
          v-else
          :address="item"
          :displayDeleteBtn="!!id"
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppAddressForm from '@/modules/profile/components/addressForm'
import service from '../../services/address.service'
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'

export default {
  name: 'AddressDetails',
  components: {
    AppAddressForm,
    AppLoadSpinner,
  },
  mixins: [pageDetailsMixin],
  data() {
    return {
      service: service,
    }
  },
}
</script>
<style></style>
