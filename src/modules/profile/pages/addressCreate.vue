<template>
  <v-container>
    <v-row>
      <v-col>
        <app-address-autocomplete @change="getParsedAddress" />
        <div
          v-if="parsedAddress && parsedAddress.data.house_fias_id"
          class="text-caption"
        >
          фиас-id{{ parsedAddress.data.house_fias_id }}
        </div>
        <v-text-field solo label="Наименование" v-model="form.name" />
        <div>
          Компании:
          {{ companyIds }}
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import AppAddressAutocomplete from '../components/addressAutocomplete'

export default {
  name: 'AddressEdit',
  data() {
    return {
      parsedAddress: null,
      form: {
        name: null,
      },
    }
  },
  methods: {
    getParsedAddress(val) {
      this.parsedAddress = Object.assign({}, val)
      this.form.name = val.value
    },
  },
  computed: {
    ...mapGetters(['myCompanies']),
    companyIds() {
      return this.myCompanies.map((item) => item._id)
    },
  },
  components: {
    AppAddressAutocomplete,
  },
}
</script>
<style></style>
