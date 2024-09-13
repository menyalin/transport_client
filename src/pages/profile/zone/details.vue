<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <LoadSpinner v-if="loading" />
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
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'

import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'
import AppZoneForm from '@/modules/profile/components/zoneForm'
import { ZoneService } from '@/shared/services'
import { LoadSpinner } from '@/shared/ui'

export default defineComponent({
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
})
</script>
<style></style>
