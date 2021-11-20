<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-load-spinner v-if="loading" />
        <app-downtime-form
          v-else
          :downtime="item"
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
import AppDowntimeForm from '@/modules/profile/components/downtimeForm'
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'
import service from '../../services/downtime.service'
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'

export default {
  name: 'PartnerDetails',
  components: {
    AppDowntimeForm,
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
