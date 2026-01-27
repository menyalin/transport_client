<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <CarrierForm
          :loading="carrierStore.loading"
          @submit="submitHandler"
          @cancel="cancelHandler"
          :agreementItems="carrierAgreements"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { CarrierForm, useCarrierStore } from '@/entities/carrier'
import { useCarrierAgreements } from '@/entities/carrierAgreement'
import { getCurrentInstance } from 'vue'

export default {
  name: 'CarrierCreatePage',
  components: {
    CarrierForm,
  },
  setup() {
    const { proxy } = getCurrentInstance()
    const carrierStore = useCarrierStore()
    const { items } = useCarrierAgreements()

    async function submitHandler(carrier) {
      await carrierStore.create(carrier)
      proxy.$router.push({ name: 'CarrierList' })
    }

    async function cancelHandler() {
      proxy.$router.push({ name: 'CarrierList' })
    }
    return {
      carrierAgreements: items,
      carrierStore,
      submitHandler,
      cancelHandler,
    }
  },
}
</script>
<style></style>
