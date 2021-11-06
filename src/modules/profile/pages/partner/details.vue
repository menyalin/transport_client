<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-load-spinner v-if="loading" />
        <app-partner-form
          v-else
          :partner="item"
          :displayDeleteBtn="!!id"
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppPartnerForm from '@/modules/profile/components/partnerForm'
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'
import service from '../../services/partner.service'
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'

export default {
  name: 'PartnerDetails',
  components: {
    AppPartnerForm,
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
