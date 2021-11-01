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
import cacheFormMixinBuilder from '@/modules/common/mixins/cacheFormMixinBuilder'

export default {
  name: 'AddressCreate',
  components: {
    AppAddressForm,
  },
  mixins: [cacheFormMixinBuilder()],
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
          this.$router.push({ name: 'AddressList' })
        })
        .catch((e) => {
          this.loading = false
          this.$store.commit('setError', e)
        })
    },
    cancel() {
      this.$router.go(-1)
    },
  },
}
</script>
<style></style>
