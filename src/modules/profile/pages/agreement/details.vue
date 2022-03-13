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
        <app-agreement-form
          v-else
          :agreement="item"
          :displayDeleteBtn="!!id && $store.getters.hasPermission('agreement:delete')"
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppAgreementForm from '@/modules/profile/components/agreementForm'
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'
import service from '../../services/agreement.service'
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'

export default {
  name: 'DowntimeDetails',
  components: {
    AppAgreementForm,
    AppLoadSpinner,
  },
  mixins: [pageDetailsMixin],
  data() {
    return {
      service: service,
    }
  },
}
</script>
<style></style>
