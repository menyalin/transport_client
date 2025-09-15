<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-alert
          v-model="error.show"
          closable
          type="error"
          @update:model-value="toggleAlert"
        >
          {{ error.message }}
        </v-alert>
        <load-spinner v-if="loading" />
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
import { LoadSpinner } from '@/shared/ui'
import { useCarriers } from '@/entities/carrier'
import { AgreementService } from '@/shared/services'
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'

export default {
  name: 'AgreementDetails',
  components: {
    AgreementForm,
    LoadSpinner,
  },
  mixins: [pageDetailsMixin],
  setup() {
    const { allCarriers: carrierItems } = useCarriers()
    return { carrierItems }
  },
  data() {
    return {
      service: AgreementService,
    }
  },
}
</script>
<style></style>
