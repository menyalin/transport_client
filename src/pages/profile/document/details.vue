<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <load-spinner v-if="loading" />
        <app-document-form
          v-else
          :document="item"
          :displayDeleteBtn="
            !!id && $store.getters.hasPermission('document:delete')
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
import AppDocumentForm from '@/modules/profile/components/documentForm'
import { LoadSpinner } from '@/shared'
import { DocumentService } from '@/shared/services'
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'

export default {
  name: 'DocumentDetails',
  components: {
    AppDocumentForm,
    LoadSpinner,
  },
  mixins: [pageDetailsMixin],
  data() {
    return {
      service: DocumentService,
    }
  },
}
</script>
<style></style>
