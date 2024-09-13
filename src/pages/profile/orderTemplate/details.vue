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
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'

import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'
import AppOrderTemplateForm from '@/modules/profile/components/orderTemplateForm'
import { OrderTemplateService } from '@/shared/services'
import { LoadSpinner } from '@/shared/ui/index'

export default defineComponent({
  name: 'OrderTemplateDetails',
  components: {
    AppOrderTemplateForm,
    LoadSpinner,
  },
  mixins: [pageDetailsMixin],
  data() {
    return {
      service: OrderTemplateService,
    }
  },
})
</script>
<style></style>
