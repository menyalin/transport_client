<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <LoadSpinner v-if="loading" />
        <app-city-form
          v-else
          :city="item"
          :displayDeleteBtn="
            !!id && $store.getters.hasPermission('city:delete')
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
import AppCityForm from '@/modules/profile/components/cityForm'
import { CityService } from '@/shared/services'
import { LoadSpinner } from '@/shared/ui'

export default defineComponent({
  name: 'RegionDetails',
  components: {
    AppCityForm,
    LoadSpinner,
  },
  mixins: [pageDetailsMixin],
  data() {
    return {
      service: CityService,
    }
  },
})
</script>
