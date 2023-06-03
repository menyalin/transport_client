<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-load-spinner v-if="loading" />
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
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'
import {RegionService } from '@/shared/services'
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'

export default {
  name: 'RegionDetails',
  components: {
    AppRegionForm,
    AppLoadSpinner,
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
