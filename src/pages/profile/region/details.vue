<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <LoadSpinner v-if="loading" />
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
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'

import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'
import AppRegionForm from '@/modules/profile/components/regionForm'
import { RegionService } from '@/shared/services'
import { LoadSpinner } from '@/shared/ui/index'

export default defineComponent({
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
})
</script>
<style></style>
