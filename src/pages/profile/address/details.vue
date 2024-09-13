<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-alert
          v-model="error.show"
          dismissible
          type="error"
          transition="scale-transition"
          @change="toggleAlert"
        >
          {{ error.message }}
        </v-alert>
        <LoadSpinner v-if="loading" />
        <app-address-form
          v-else
          :address="item"
          :displayDeleteBtn="
            !!id && $store.getters.hasPermission('address:delete')
          "
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'

import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'
import AppAddressForm from '@/modules/profile/components/addressForm'
import { AddressService } from '@/shared/services'
import { LoadSpinner } from '@/shared/ui'

export default defineComponent({
  name: 'AddressDetails',
  components: {
    AppAddressForm,
    LoadSpinner,
  },
  mixins: [pageDetailsMixin],
  data() {
    return {
      service: AddressService,
    }
  },
})
</script>
<style></style>
