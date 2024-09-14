<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-alert
          v-model="error.show"
          closable
          type="error"
          @change="toggleAlert"
        >
          {{ error.message }}
        </v-alert>
        <LoadSpinner v-if="loading" />
        <agreement-form
          v-else
          :agreement="item"
          :displayDeleteBtn="
            !!id && $store.getters.hasPermission('agreement:delete')
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

import { AgreementForm } from '@/entities/agreement'
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'
import { AgreementService } from '@/shared/services'
import { LoadSpinner } from '@/shared/ui'

export default defineComponent({
  name: 'AgreementDetails',
  components: {
    AgreementForm,
    LoadSpinner,
  },
  mixins: [pageDetailsMixin],
  data() {
    return {
      service: AgreementService,
    }
  },
})
</script>
<style></style>
