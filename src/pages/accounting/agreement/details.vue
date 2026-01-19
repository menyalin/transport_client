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
        <app-load-spinner v-if="loading" />
        <agreement-form
          v-else
          :agreement="item"
          :displayDeleteBtn="
            !!id && $store.getters.hasPermission('agreement:delete')
          "
          :carrierItems="carrierItems"
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { AgreementForm } from '@/entities/agreement'
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'
import { AgreementService } from '@/shared/services'
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'

export default {
  name: 'AgreementDetails',
  components: {
    AgreementForm,
    AppLoadSpinner,
  },
  mixins: [pageDetailsMixin],
  setup() {
    const carrierStore = useCarrierStore()
    return { carrierItems: carrierStore.carriers }
  },
  data() {
    return {
      service: AgreementService,
    }
  },
}
</script>
<style></style>
