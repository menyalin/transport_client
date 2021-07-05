<template>
  <v-container>
    <v-row>
      <v-col>
        <app-address-form @submit="submit" @cancel="cancel" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppAddressForm from '@/modules/profile/components/addressForm'

export default {
  name: 'AddressCreate',
  data() {
    return {
      loading: false,
    }
  },
  components: {
    AppAddressForm,
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
