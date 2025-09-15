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
        <app-order-template-form
          v-else
          :orderTemplate="item"
          :displayDeleteBtn="
            !!id && $store.getters.hasPermission('orderTemplate:delete')
          "
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { provide } from 'vue'
import AppOrderTemplateForm from '@/modules/profile/components/orderTemplateForm'
import { LoadSpinner } from '@/shared/ui'
import { OrderTemplateService } from '@/shared/services'
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'
import { useAddress } from '@/entities/address'

export default {
  name: 'OrderTemplateDetails',
  components: {
    AppOrderTemplateForm,
    LoadSpinner,
  },
  mixins: [pageDetailsMixin],
  setup() {
    const { actions: addressActions } = useAddress()
    provide('addressActions', addressActions)
  },
  data() {
    return {
      service: OrderTemplateService,
    }
  },
}
</script>
<style></style>
