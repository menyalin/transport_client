<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-alert v-model="error.show" closable type="error" @change="toggleAlert">
          {{ error.message }}
        </v-alert>
        <load-spinner v-if="loading" />
        <agreement-form
          v-else
          :agreement="item"
          :displayDeleteBtn="!!id && $store.getters.hasPermission('agreement:delete')"
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
import { computed } from 'vue'
import { AgreementForm } from '@/entities/agreement'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'
import { AgreementService } from '@/shared/services'
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'
import { LoadSpinner } from '@/shared/ui'

export default {
  name: 'AgreementDetails',
  components: {
    AgreementForm,
    LoadSpinner,
  },
  mixins: [pageDetailsMixin],
  setup() {
    const carrierStore = useCarrierStore()
    return { carrierItems: computed(() => carrierStore.carriers) }
  },
  data() {
    return {
      service: AgreementService,
    }
  },
}
</script>
<style></style>
