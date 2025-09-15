<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <load-spinner v-if="loading" />
        <app-region-form
          v-else
          :region="item"
          :displayDeleteBtn="
            !!id && $store.getters.hasPermission('region:delete')
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
import AppRegionForm from '@/modules/profile/components/regionForm'
import { LoadSpinner } from '@/shared/ui'
import { RegionService } from '@/shared/services'
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'

export default {
  name: 'RegionDetails',
  components: {
    AppRegionForm,
    LoadSpinner,
  },
  mixins: [pageDetailsMixin],
  data() {
    return {
      service: RegionService,
    }
  },
}
</script>
<style></style>
