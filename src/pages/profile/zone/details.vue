<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <load-spinner v-if="loading" />
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
import { LoadSpinner } from '@/shared/ui'
import { ZoneService } from '@/shared/services'
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'

export default {
  name: 'PartnerDetails',
  components: {
    AppZoneForm,
    LoadSpinner,
  },
  mixins: [pageDetailsMixin],
  data() {
    return {
      service: ZoneService,
    }
  },
}
</script>
<style></style>
