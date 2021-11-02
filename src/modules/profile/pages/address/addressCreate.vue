<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-address-form
          :formName="formName"
          :address="formCache"
          @submit="submit"
          @cancel="cancel"
          @saveToCache="saveToCache"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppAddressForm from '@/modules/profile/components/addressForm'
import cacheFormMixin from '@/modules/common/mixins/cacheFormMixin'

export default {
  name: 'AddressCreate',
  components: {
    AppAddressForm,
  },
  mixins: [cacheFormMixin],
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    formName() {
      return 'createAddress'
    },
  },
  methods: {
    submit(address) {
      this.loading = true
      this.$store
        .dispatch('createAddress', address)
        .then(() => {
          this.loading = false
          this.$router.go(-1)
          this.clearCache()
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
