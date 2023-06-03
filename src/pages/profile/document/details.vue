<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-load-spinner v-if="loading" />
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
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'
import { DowntimeService } from '@/shared/services'
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'

export default {
  name: 'DocumentDetails',
  components: {
    AppDocumentForm,
    AppLoadSpinner,
  },
  mixins: [pageDetailsMixin],
  data() {
    return {
      service: DowntimeService,
    }
  },
}
</script>
<style></style>
