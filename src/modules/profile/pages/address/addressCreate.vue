<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-load-spinner v-if="loading" />
        <app-address-form
          v-else
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
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'

export default {
  name: 'AddressCreate',
  components: {
    AppAddressForm,
    AppLoadSpinner,
  },
  mixins: [cacheFormMixin],

  computed: {
    formName() {
      return 'AddressCreate'
    },
  },
  methods: {
    submit(address) {
      this.needFormCache = false
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
