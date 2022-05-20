<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-load-spinner v-if="loading" />
        <app-zone-form
          v-else
          :zone="item"
          :displayDeleteBtn="
            !!id && $store.getters.hasPermission('zone:delete')
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
import AppZoneForm from '@/modules/profile/components/zoneForm'
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'
import service from '../../services/zone.service'
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'

export default {
  name: 'PartnerDetails',
  components: {
    AppZoneForm,
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
